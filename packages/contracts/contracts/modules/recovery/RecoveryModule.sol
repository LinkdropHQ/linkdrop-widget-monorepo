pragma solidity ^0.5.6;
import "@gnosis.pm/safe-contracts/contracts/base/Module.sol";

/**
* @title Recovery Module for Gnosis Safe
* @author Amir Jumaniyazov - <amir@linkdrop.io>
*/
contract RecoveryModule is Module {

    // Indicates whether an address is a guardian
    mapping (address => bool) public isGuardian;

    address[] public guardians;

    // Recovery period duration (in seconds)
    uint public recoveryPeriod;

    // Recovery initiation timestamp
    uint public recoveryInitiated;

    address private prevOwner;
    address private oldOwner;
    address private newOwner;

    event RecoveryInitiated(address indexed oldOwner, address indexed newOwner);
    event RecoveryFinalized();
    event RecoveryCanceled();
    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);

    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "Only guardian");
        _;
    }

    string public constant NAME = "Recovery Module";
    string public constant VERSION = "0.1.0";

    /**
    * @dev Function to setup the initial storage of module
    * @param _guardians Array of guardians addresses
    * @param _recoveryPeriod Recovery period duration (in atomic units - seconds)
    */
    function setup(address[] memory _guardians, uint _recoveryPeriod)
    public
    {
        setManager();
        for (uint i = 0; i < _guardians.length; i++) {
            address guardian = _guardians[i];
            require(guardian != address(0), "Invalid guardian address");
            require(!isGuardian[guardian], "Duplicate guardian address");
            isGuardian[guardian] = true;
        }
        guardians = _guardians;
        recoveryPeriod = _recoveryPeriod;
    }

    /**
    * @dev Function to initiate recovery. Can only be called by guardian
    * @param _prevOwner Owner that pointed to the owner to be replaced in the linked list
    * @param _oldOwner Owner address to be replaced
    * @param _newOwner New owner address
    */
    function initiateRecovery
    (
        address _prevOwner,
        address _oldOwner,
        address _newOwner
    )
    public
    onlyGuardian
    {
        require(recoveryInitiated == 0, "Recovery is already initiated");
        /* solium-disable-next-line */
        recoveryInitiated = now;

        prevOwner = _prevOwner;
        oldOwner = _oldOwner;
        newOwner = _newOwner;

        emit RecoveryInitiated(oldOwner, newOwner);
    }

    /**
    * @dev Function to cancel recovery. Can only be called via Safe transaction
    */
    function cancelRecovery()
    public
    authorized
    {
        require(recoveryInitiated != 0, "Recovery is not initiated");
        delete recoveryInitiated;
        delete prevOwner;
        delete oldOwner;
        delete newOwner;

        emit RecoveryCanceled();
    }

    /**
    * @dev Function to recover access (change Safe owner). Can only be called by guardian
    * @return True if transaction executes successfully, false otherwise
    */
    function recoverAccess()
    public
    onlyGuardian
    {
        require(recoveryInitiated != 0, "Recovery is not initiated");
        /* solium-disable-next-line */
        require(now - recoveryInitiated >= recoveryPeriod, "Recovery period is not over");

        bytes memory data = abi.encodeWithSignature("swapOwner(address,address,address)", prevOwner, oldOwner, newOwner);
        require(manager.execTransactionFromModule(address(manager), 0, data, Enum.Operation.Call), "Recovery failed");
        delete recoveryInitiated;
        delete prevOwner;
        delete oldOwner;
        delete newOwner;

        emit RecoveryFinalized();
    }

    /**
    * @dev Function to add new guardian. Can only be called via Safe transaction
    * @param _guardian Guardian address to be added
    */
    function addGuardian(address _guardian)
    public
    authorized
    {
        require(_guardian != address(0), "Invalid guardian address");
        require(!isGuardian[_guardian], "Duplicate guardian address");
        isGuardian[_guardian] = true;

        emit GuardianAdded(_guardian);
    }

    /**
    * @dev Function to remove existing guardian. Can only be called via Safe transaction
    * @param _guardian Guardian address to be removed
    */
    function removeGuardian(address _guardian)
    public
    authorized
    {
        require(isGuardian[_guardian], "Invalid guardian address");
        delete isGuardian[_guardian];

        emit GuardianRemoved(_guardian);
    }

}
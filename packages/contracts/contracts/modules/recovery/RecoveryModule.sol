pragma solidity ^0.5.6;
import "@gnosis.pm/safe-contracts/contracts/base/OwnerManager.sol";
import "@gnosis.pm/safe-contracts/contracts/base/Module.sol";


contract RecoveryModule is Module {

    mapping (address => bool) public isGuardian;

    address[] public guardians;

    uint public recoveryPeriod; // Recovery period duration (seconds)

    uint public recoveryInitiated; // Recovery initiated timestamp

    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "Only guardian");
        _;
    }

    /**
    * @dev Function to setup the initial storage of module
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

    // Can only be called by guardian
    function initiateRecovery()
    public
    onlyGuardian
    {
        require(recoveryInitiated == 0, "Recovery is already initiated");
        /* solium-disable-next-line */
        recoveryInitiated = now;
    }

    // Can only be called via Safe transaction
    function cancelRecovery()
    public
    authorized
    {
        require(recoveryInitiated != 0, "Recovery is not initiated");
        delete recoveryInitiated;
    }

    /**
    * @param _prevOwner Owner that pointed to the owner to be replaced in the linked list
    * @param _oldOwner Owner address to be replaced
    * @param _newOwner New owner address
    * @return True if transaction executes successfully, false otherwise
    */
    function recoverAccess
    (
        address _prevOwner,
        address _oldOwner,
        address _newOwner
    )
    public
    onlyGuardian
    {
        require(recoveryInitiated != 0, "Recovery is not initiated");
        /* solium-disable-next-line */
        require(now - recoveryInitiated >= recoveryPeriod, "Recovery period is not over");

        bytes memory data = abi.encodeWithSignature("swapOwner(address,address,address)", _prevOwner, _oldOwner, _newOwner);
        require(manager.execTransactionFromModule(address(manager), 0, data, Enum.Operation.Call), "Recovery failed");
        delete recoveryInitiated;
    }

}
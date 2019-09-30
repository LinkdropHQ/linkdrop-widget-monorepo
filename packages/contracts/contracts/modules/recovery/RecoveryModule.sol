pragma solidity ^0.5.6;
import "@gnosis.pm/safe-contracts/contracts/base/OwnerManager.sol";

contract RecoveryModule {

    mapping (address => bool) isGuardian;

    address[] public guardians;

    uint public recoveryPeriod; // Recovery period duration

    uint public recoveryInitiated; // Recovery initiated timestamp

    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "ONLY_GUARDIAN");
        _;
    }

    /**
    * @dev Function to setup the initial storage of module
    */
    function setup(address[] _guardians)
    public
    {
        setManager();

        for (uint i = 0; i < _guardians.length; i++) {
            address guardian = _guardians[i];
            require(guardian != address(0), "INVALID_GUARDIAN_ADDRESS");
            require(!isGuardian[guardian], "DUPLICATE_GUARDIAN_ADDRESS");
            isGuardian[guardian] = true;
        }

        guardians = _guardians;
        recoveryPeriod = 3 days;
    }

    function initiateRecovery()
    public
    onlyGuardian
    {
        require(recoveryInitiated == 0, "RECOVERY_ALREADY_INITIATED");
        /* solium-disable-next-line */
        recoveryInitiated = now;
    }

    function cancelRecovery()
    public
    authorized
    {
        require(recoveryInitiated != 0, "RECOVERY_NOT_INITIATED");
        delete recoveryInitiated;
    }

    function recoverAccess
    (
        address _prevOwner,
        address _oldOwner,
        address _newOwner
    )
    public
    onlyGuardian
    {
        require(recoveryInitiated != 0, "RECOVERY_NOT_INITIATED");
        /* solium-disable-next-line */
        require(now - recoveryInitiated >= recoveryPeriod, "RECOVERY_PERIOD_NOT_PASSED");
        require(manager.execTransactionFromModule(address(manager), 0, data, Enum.Operation.Call), "RECOVERY_FAILED");
    }

}
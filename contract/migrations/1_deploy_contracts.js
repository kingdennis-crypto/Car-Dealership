var DealerShip = artifacts.require('../contracts/Dealership.sol')

module.exports = function (deployer) {
  deployer.deploy(DealerShip, 'Trivago')
}
var DealerShip = artifacts.require('../contracts/Dealership.sol')
var HedgeHog = artifacts.require('../contracts/CarDealership.sol')
var GameItem = artifacts.require('../contracts/GameItem.sol')

module.exports = function (deployer) {
  // deployer.deploy(DealerShip, 'Trivago')
  deployer.deploy(HedgeHog)
  // deployer.deploy(GameItem)
}
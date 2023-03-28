var Library = artifacts.require('../contracts/CarDealershipStrings.sol')
var HedgeHog = artifacts.require('../contracts/CarDealership.sol')

module.exports = function (deployer) {
  deployer.deploy(Library)
  deployer.deploy(HedgeHog)
}

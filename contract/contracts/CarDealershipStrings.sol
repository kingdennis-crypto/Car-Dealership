// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

library CarDealershipStrings {
  string public constant CAR_DOES_NOT_EXIST = "Car not found";
  string public constant CANT_BUY_OWN_CAR = "You cannot buy your own car";
  string public constant CAR_ALREADY_SOLD = "The car has already been sold";
  string public constant INSUFFICIENT_FUNDS = "Insufficient funds for buying the car";
  string public constant CAR_NOT_SOLD = "The car has not been sold yet";
  string public constant ONLY_BUYER = "Only the buyer can retrieve this car";
  string public constant FAILED_TO_SENT_ETHER = "Failed to transfer ether";
  string public constant ONLY_BUYER_CANCEL = "Only the buyer can cancel this order";
}
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

// TODO: Create a seperate contract for car types
contract Dealership {
  uint256 COMMISION_FOR_CAR = 0.1 ether;

  string name;

  Car[] cars;

  // Set the index of the plate in the cars array
  mapping(string => uint256) indexOfPlate;
  mapping(address => uint256[]) indexOfOwner;
  mapping(string => bool) plateExists;

  // event Deposit(address indexed _from, bytes32 indexed _id, uint _value);
  event CreateCar(string licensePlate);
  event CarMileageChanged(string licensePlate);

  struct Car {
    address owner;
    string licensePlate;
    uint256 chassisNumber;
    string brand;
    string carType;
    string colour;
    uint256 mileage;
    string imageUrl; // TODO: Add struct for IPFS and HTTP address
  }

  string constant LOWER_MILEAGE = "The mileage you provided can't be lower that the current mileage!";
  string constant UNRECOGNIZED_LICENSEPLATE = "A car with this licenseplate does not exist!";
  string constant CAR_ALREADY_EXISTS = "You can't register this car, because this licenseplate is already taken!";

  constructor(string memory _name) {
    name = _name;

    Car memory car1 = Car(
      0x498C2f07f3C28A5EE65c3Cc723Bed64B9EeaA88f,
      "28-TGJ-1",
      123,
      "Ford",
      "SUV",
      "red",
      1024,
      "213"
    );

    Car memory car2 = Car(
      0x498C2f07f3C28A5EE65c3Cc723Bed64B9EeaA88f,
      "28-TGJ-1",
      123,
      "Ford",
      "SUV",
      "red",
      1024,
      "213"
    );

    cars.push(car1);
    cars.push(car2);
  }

  /// @notice Create a car on this contract
  function addCar(
    address _owner,
    string memory _licenseplate,
    uint256 _chassisNumber,
    string memory _brand,
    string memory _carType,
    string memory _colour,
    uint256 _mileage,
    string memory _imageUrl
  ) public {
    Car memory _car = Car(
      _owner,
      _licenseplate,
      _chassisNumber,
      _brand,
      _carType,
      _colour,
      _mileage,
      _imageUrl
    );

    // If there already is a car with the license plate in the dealership return error
    require(plateExists[_licenseplate] == false, CAR_ALREADY_EXISTS);

    cars.push(_car);
    uint index = cars.length - 1;

    // TODO: When adding a car, pay a commision for payments. 0.1 ethers

    plateExists[_licenseplate] = true;
    indexOfPlate[_licenseplate] = index;

    uint256[] storage plates = indexOfOwner[_owner];
    plates.push(index);
    indexOfOwner[_owner] = plates;

    emit CreateCar(_licenseplate);
  }

  /// @notice Remove a car from this contract
  function removeCar(string memory _licenseplate) public {
    require(plateExists[_licenseplate] == true, UNRECOGNIZED_LICENSEPLATE);

    // FIXME: THERE IS A KANKER HINDERLIJKE INDEX OUT OF RANGE ERROR
    uint index = indexOfPlate[_licenseplate];
    require(index < cars.length, "Index out of range");

    cars[index] = cars[cars.length - 1];
    cars.pop();

    delete plateExists[_licenseplate];
    delete indexOfPlate[_licenseplate];
  }

  /// @notice Get the car information by license plate
  function getCar(string memory _licensePlate) public view returns (Car memory) {
    require(plateExists[_licensePlate] == true, UNRECOGNIZED_LICENSEPLATE);

    // FIXME: Is the licenseplate isn't correct it will return the first item
    return cars[indexOfPlate[_licensePlate]];
  }

  function getCarsByOwner(address _owner) public view returns (Car[] memory) {
    uint256[] memory _plates = indexOfOwner[_owner];
    Car[] memory _cars = new Car[](_plates.length);

    for (uint i = 0; i < _plates.length; i++) {
      _cars[i] = cars[_plates[i]];
    }

    return _cars;
  }

  /// @notice Return all cars that are saved in this contract
  function getAllCars() public view returns (Car[] memory) {
    return cars;
  }

  /// @notice change the mileage of the car
  function changeMileage(string memory _licensePlate, uint256 _mileage) public {
    require(plateExists[_licensePlate] == true, UNRECOGNIZED_LICENSEPLATE);

    Car memory _car = cars[indexOfPlate[_licensePlate]];
    require(_mileage > _car.mileage, LOWER_MILEAGE);
    _car.mileage = _mileage;

    cars[indexOfPlate[_licensePlate]] = _car;
    emit CarMileageChanged(_car.licensePlate);
  }

  /// @notice Function to buy a car from an owner
  // function buyCar() public {
  //   address payable _to = payable(0x9A52E9cd2b6FafEb2876d63eB9Cda109E45ecE67);
  //   uint256 _amount = 1 ether;

  //   // payment.sendPayment{value: _amount}(_to, _amount);
  //   // payment.transferMoney(_to, _amount);
  // }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Transcript {
    uint public ctr = 0;
    // for data
    struct Student{
        string email;
        string name;
        string matric;
        address key;
        string department;
        string faculty;
        uint duration;
        string gender;
    }

    struct Course{
        string title;
        string code;
        uint unit;
        string grade;
        string remark;
        string session;
    }

    mapping (address => Student) public students;
    mapping (address => uint) public counter;
    mapping (address => mapping(uint => Course)) public results;

    event StudentCreated(address indexed studentKey, string email, string matric);
    event TranscriptCreated(address indexed studentKey, string session, string courseCode);

    function createStudent(
        string calldata _email,
        string calldata _name,
        string calldata _matric,
        address _pkey,
        string calldata _faculty,
        string calldata _department,
        uint _duration,
        string calldata _gender
    ) external {
        require(_pkey != address(0), "Invalid address");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_matric).length > 0, "Matric number cannot be empty");
        
        students[_pkey] = Student(_email, _name, _matric, _pkey, _department, _faculty, _duration, _gender);
        counter[_pkey] = 0;
        
        emit StudentCreated(_pkey, _email, _matric);
    }

    function createTranscript(
        address key,
        string calldata _session,
        string calldata _courseCode,
        string calldata _courseTitle,
        uint _creditLoad,
        string calldata _grade,
        string calldata _remark
    ) external {
        require(key != address(0), "Invalid address");
        require(bytes(_session).length > 0, "Session cannot be empty");
        require(bytes(_courseCode).length > 0, "Course code cannot be empty");
        
        uint c = counter[key];
        results[key][c] = Course(_courseTitle, _courseCode, _creditLoad, _grade, _remark, _session);
        counter[key] = c + 1;
        
        emit TranscriptCreated(key, _session, _courseCode);
    }
}
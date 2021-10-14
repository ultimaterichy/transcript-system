pragma solidity >=0.4.22 <0.9.0;

contract Transcript{
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

    function createStudent(string calldata _email, string calldata _name, string calldata _matric, address _pkey, string calldata _faculty, string calldata _department, uint _duration, string calldata _gender) external {
        // create student
        students[_pkey] = Student(_email, _name, _matric, _pkey, _department, _faculty, _duration, _gender);
        // add student to map
        counter[_pkey] = 0;
    }

    function createTranscript(
        address key, string calldata _session, string calldata _courseCode, string calldata __courseTitle,
        uint _creditLoad, string calldata _grade, string calldata _remark
    ) external {
        
        // add course to results with session as key
        uint c = counter[key];
        results[key][c] = Course(
            __courseTitle,
            _courseCode,
            _creditLoad,
            _grade,
            _remark,
            _session
        );
        // increment counter
        counter[key] = counter[key] + 1;
    }
}
// script.js
const url = "http://localhost:3000"


function searchAttendance() {
  const date = document.getElementById('dateSelector').value;

  // Fetch both student data and attendance data
  axios.all([
    axios.get(`${url}/students`),
    axios.get(`${url}/attendance?date=${date}`)
  ])
    .then(axios.spread((studentsResponse, attendanceResponse) => {
      const students = studentsResponse.data;
      const attendance = attendanceResponse.data;

      // Process the fetched student and attendance data
      console.log('Fetched student data:', students);
      console.log('Fetched attendance data:', attendance);

      // Display the student list and attendance data on the frontend
      displayAttendance(students, attendance);
    }))
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function fetchAttendanceReport() {
  axios.get(`${url}/attendance/report`)
    .then(response => {

      displayAttendanceReport(response.data);
    })
    .catch(error => {
      console.error('Error fetching attendance report:', error);
    });
}



function displayAttendance(students, attendance) {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = '';
  console.log(attendance)
  console.log(students)

  students.forEach(student => {
    const studentContainer = document.createElement('div');
    studentContainer.classList.add('student-container');
    const studentName = document.createElement('p');
    studentName.textContent = student.name;
    studentContainer.appendChild(studentName);

    const studentAttendance = attendance.find(record => record.StudentId === student.id);

    let attendanceStatusText = 'Attendance: ';
    
    if (studentAttendance) {
      attendanceStatusText += studentAttendance.present ? 'Present' : 'Absent';
    } else {
      // attendanceStatusText += 'Absent';
      const presentRadio = createRadioButton(student.id, 'present');
      const absentRadio = createRadioButton(student.id, 'absent');

      const radioContainer = document.createElement('div');
      radioContainer.appendChild(presentRadio);
      radioContainer.appendChild(createLabel('Present', presentRadio));
      radioContainer.appendChild(absentRadio);
      radioContainer.appendChild(createLabel('Absent', absentRadio));

      studentContainer.appendChild(radioContainer);
    }
    const attendanceStatus = document.createElement('p');
    attendanceStatus.textContent = attendanceStatusText;
    studentContainer.appendChild(attendanceStatus);
    mainContent.appendChild(studentContainer);
  });

  const markButton = document.createElement('button');
  markButton.textContent = 'Mark Attendance';
  markButton.addEventListener('click', markAttendance);
  mainContent.appendChild(markButton);
}

function createRadioButton(studentId, value) {
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = studentId;
  radio.value = value;
  return radio;
}

function createLabel(text, associatedInput) {
  const label = document.createElement('label');
  label.textContent = text;
  label.appendChild(associatedInput);
  return label;
}


function markAttendance() {
  console.log("inside mark")
  const date = document.getElementById('dateSelector').value;
  const attendanceData = [];

  // Get studentId from the radio button name attribute
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    console.log(radio.name)
    if (radio.checked) {
      attendanceData.push({
        StudentId: radio.name, // Include studentId
        present: radio.value === 'present'
      });
    }
  });

  if (attendanceData.length === 0) {
    console.log('No attendance data to submit.');
    return;
  }

  axios.post(`${url}/attendance`, {
    date: date,
    attendance: attendanceData
  })
    .then(() => {
      console.log(attendanceData)
      console.log('Attendance marked successfully');
      // Clear radio button selections
      radios.forEach(radio => {
        radio.checked = false;
      });
    })
    .catch(error => {
      console.error('Error marking attendance:', error);
    });
}


function displayAttendanceReport(reportData) {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = '';

  reportData.data.forEach(student => {
    let percentage = (student.DaysPresent / student.AttendanceCount) * 100;
    percentage=parseFloat(percentage.toFixed(2));
    const div = document.createElement('div');
    div.innerHTML = `
        <p>${student.StudentId}:${student.StudentName}: ${student.DaysPresent}/${student.AttendanceCount}- ${percentage}% </p>
      `;
    mainContent.appendChild(div);
  });
}

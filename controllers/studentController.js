const express = require('express');
var router = express.Router();

// For database
const mongoose = require('mongoose');
const Student = mongoose.model('Student');  // For creating model

// Display addEditRecords
router.get('/', (req, res) => {
    res.render("student/addEditRecords", {
        viewTitle: "Insert a record for a student"
    });
});

// Check for insertion or updation
router.post('/', (req, res) => {
    if (req.body._id == '')
        insertStudentRecord(req, res);
        else
        updateStudentRecord(req, res);
});

// Insert a new record
function insertStudentRecord(req, res) {
    var student = new Student();
    student.fullName = req.body.fullName;
    student.email = req.body.email;
    student.mobile = req.body.mobile;
    student.city = req.body.city;
    student.save((err, doc) => {
        if (!err)
            res.redirect('student/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("student/addEditRecords", {
                    viewTitle: "Insert a record for a student",
                    student: req.body
                });
            }
            else
                console.log('There was an error during record insertion: ' + err);
        }
    });
}

function updateStudentRecord(req, res) {
    Student.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('student/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("student/addEditRecords", {
                    viewTitle: 'Update a student\'s record',
                    student: req.body
                });
            }
            else
                console.log('There was an error during record updation: ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Student.find((err, docs) => {
        if (!err) {
            res.render("student/list", {
                list: docs
            });
        }
        else {
            console.log('There was an error in retrieving the students\' list: ' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Student.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("student/addEditRecords", {
                viewTitle: "Update a student\'s record",
                student: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Student.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/student/list');
        }
        else { console.log('There was an error during record deletion: ' + err); }
    });
});

module.exports = router;
const express = require('express');
const app = express();
const Joi = require('joi');
const port = process.env.port || 3000;

app.use(express.json());

let courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'},
]

//GET
//To get all courses
app.get('/api/courses', (req, res) => {
  res.send(courses);
});
//To get an specific course
app.get('/api/courses/:id', (req, res) => {
  //Look up for the course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  //If does not exist return 404
  if(!course) return res.status(404).send('The course with given ID is not found...');
  res.send(course);
});

//POST
app.post('/api/courses', (req, res) => {
  //Validate request
  const result = validateCourse(req.body)
  //If request is invalid, return 400 - Bad request
  if(result.error) return res.status(400).send(result.error.details[0].message);
  //Post the new course
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

//PUT
app.put('/api/courses/:id', (req, res) => {
  //Look up for the course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  //If does not exist return 404
  if(!course) return res.status(404).send('The course with given ID is not found...');

  //Validate request
  const result = validateCourse(req.body)
  //If request is invalid, return 400 - Bad request
  if(result.error) return res.status(400).send(result.error.details[0].message);
  
  //Update course
  course.name = req.body.name;
  //Sends updated course to the client
  res.send(course);
});

//DELETE
app.delete('/api/courses/:id', (req, res) => {
  //Look up for the course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  //If does not exist return 404
  if(!course) return res.status(404).send('The course with given ID is not found...');
  
  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //Sends deleted course to the client
  res.send(course);
});

//Request validator required length and name 
function validateCourse(course){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}

//Server listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
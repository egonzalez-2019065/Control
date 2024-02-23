'use scrict'
import Course from './course.model.js'
import User from '../user/user.model.js'

export const test = (req, res) => {
    console.log('test is running')
    res.send({message: 'test course is running'})
}

export const saveCourse = async(req, res) =>{
    try{
        //Capturar los datos
        let data = req.body
        //Guardar el curso 
        let curso = new Course(data)
        await curso.save()
        //Responder al usuario
        return res.send({message: `Course saved succesfully: ${curso.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving course'})
    }
}

export const enrollTeacher = async(req, res) =>{
    try{
        // Traer al Profesor
        const token  = req.user;
        // Curso a asignar
        let { id } = req.params
        // Ver si existen 
        const course = await Course.findOne({_id: id})
        const user = await User.findOne({_id: token.id, role: 'TEACHER'})
        if(!course || !user) return res.status(400).send({message: 'Course or Teacher not exists'})
        // Ver que el curso no tenga un profesor asignado
        if(course.teacher) return res.status(400).send({message: 'Already has a teacher'})
        // Asignar al profesor al curso
        course.teacher = token.id;
        await course.save();
        // Responder 
        return res.send({message: 'Teacher enrolled succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error editing course'})
        
    }  
}
export const enrollStudent = async (req, res) => {
    try {
        // Traer al Estudiante
        const token  = req.user;
        // Curso a asignar
        let { id } = req.params;
        // Ver si existen 
        const course = await Course.findOne({ _id: id });
        const user = await User.findOne({ _id: token.id, role: 'STUDENT' });
        if (!course || !user) {
            return res.status(400).send({ message: 'Course or Student not exists' });
        }
        // Ver si el estudiante ya está asignado al curso
        if (course.students.includes(token.id)) {
            return res.status(400).send({ message: 'Already has enrolled' });
        }
        // Verificar si el alumno aún puede enrolarse a cursos
        if (user.courses >= 3) {
            user.courses
            return res.status(400).send({ message: 'Maximum number of courses reached' });
        }
        // Incrementar el contador de cursos del estudiante
        user.courses += 1;
        await user.save();

        // Asignar al estudiante al curso
        course.students.push(token.id);
        await course.save();

        // Responder 
        return res.send({ message: 'Student enrolled successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error enrolling student' });
    }
}


export const editCourse = async(req, res) =>{
    try{
        //Capturar el id 
        let { id } = req.params
        // Traer el id del profesor 
        const token = req.user
        // Ver si el curso existe
        let course = await Course.findOne({_id: id})
        if(!course) return res.status(404).send({message: 'Course not exists'})
        // Capturar los datos
        let data = req.body
        // Verificar que el profesor sea el dueño del curso
        const user = await User.findOne({_id: token.id, role: 'TEACHER'})
        if (!user || !course.teacher.equals(token.id)) {
            return res.status(403).send({ message: 'You do not have permission to edit this course' });
        }
        //Actualizar 
        await Course.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )    
        // Responder al usuario
        return res.send({message: 'Course edit successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error editing course'})
    }
}

export const courseDelete = async(req, res) =>{
    try{
        // Capturar el id del curso
        let { id } = req.params
        // Capturar al profesor
        let teacher = req.user
        // Ver si el curso existe
        let course = await Course.findOne({_id: id})
        if(!course) return res.status(404).send({message: 'Course not exists'})
        // Verificar que el teacher sea el dueño del curso
        console.log(teacher.id)
        const user = await User.findOne({_id: teacher.id, role: 'TEACHER'})
            if (!user || !course.teacher.equals(teacher.id)) {
                return res.status(403).send({ message: 'You do not have permission to delete this course' });
            }
        //Eliminar
        let courseU = await Course.findOneAndDelete({_id: id});
        // Verificar si se encontró y eliminó el curso correctamente
        if (courseU) {
            // Ver que se le descuente el curso a todos los estudiantes asignados
            for (let studentsId of courseU.students) {
                let studentU = await User.findOne({_id: studentsId});
                if (studentU) {
                    studentU.courses -= 1;
                    await studentU.save();
                } else {
                console.log('Student not exists');
                }
            }
        }
        // Eliminar el curso
        return res.send({message: 'Deleted course successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deliting course'})
    }
}

export const studendCourses = async(req, res) =>{
    try{
        // Traer al estudiante
        const { id } = req.params;
        // Ver si existe
        const student = await User.findOne({ _id: id, role: 'STUDENT' });
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        // Traer los cursos
        const courses = await Course.find({ students: id }).populate('students', ['name', 'username']  );

        // Ver si tiene cursos asignados
        if (courses.length === 0) {
            return res.status(404).send({ message: 'Student is not enrolled in any courses' });
        }
        // Responder con la lista de cursos
        return res.send({ courses });
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching courses'})
    } 
}

export const getCourses = async(req, res) =>{
    try{
        // Traer los cursos
        const courses = await Course.find()
        if(!courses) return res.status(404).send({message: 'not courses found'})
        // Responder con la lista de cursos
        return res.send({ courses });
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching courses'})
    } 
}
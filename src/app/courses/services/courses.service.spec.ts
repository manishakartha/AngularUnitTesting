import { TestBed } from "@angular/core/testing"
import { CoursesService } from "./courses.service"
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";

import { HttpErrorResponse } from "@angular/common/http";

describe('Courses Service',()=>{
    let httpTestingController: HttpTestingController;
    let courses:CoursesService
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers:[
                CoursesService
            ]
        })
        courses=TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController)
    });
    it('should retrieve all course',()=>{
        courses.findAllCourses().subscribe(courses=>{
            expect(courses).toBeTruthy('No courses returned');
            expect(courses.length).toBe(12,"incorrect number of courses");
            const course = courses.find(course => course.id==12);
            expect(course.titles.description).toBe("Angular Testing Course");
        });
        const req= httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual("GET");
        req.flush({payload:Object.values(COURSES)});
    });
    it('should retreive data by id',()=>{
        courses.findCourseById(12).subscribe(course=>{
            expect(course).toBeTruthy();
            expect(course.id).toBe(12);     
        });
        const req= httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");
        req.flush(COURSES[12]);
    });
    it("should save course data",()=>{
        const changes:Partial<Course>={titles:{description:"Testing Course"}};
        courses.saveCourse(12,changes).subscribe(course=>{
            expect(course.id).toBe(12);
        });
        const req=httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body.titles.description).toEqual(changes.titles.description);    
        req.flush({...COURSES[12],...changes})
    });
    it('should give an error if test fails',()=>{
        const changes:Partial<Course>={titles:{description:"Testing Course"}};
        courses.saveCourse(12,changes).subscribe(()=>{
            fail("the save course  operation should have failed")
        },
        (error:HttpErrorResponse)=>{
            expect(error.status).toBe(500)
        });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toBe('PUT');
        req.flush('save course failed',{
            status:500,
            statusText:'Internal Server Error'
        })
    });
    it('should find a lessons',()=>{
        courses.findLessons(12).subscribe(lessons=>{
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3);
        });
        const req= httpTestingController.expectOne(req=>req.url=='/api/lessons');
        expect(req.request.method).toEqual("GET");
        expect(req.request.params.get("courseId")).toEqual('12');
        expect(req.request.params.get("filter")).toEqual('');
        expect(req.request.params.get("sortOrder")).toEqual('asc');
        expect(req.request.params.get("pageNumber")).toEqual('0');
        expect(req.request.params.get("pageSize")).toEqual('3');
        req.flush(
            {
                payload: findLessonsForCourse(12).slice(0,3)
            }
        );
    })
    afterEach(()=>{
        httpTestingController.verify();
    })
})
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CourseDialogComponent } from "./course-dialog.component";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { of } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

describe("course-dialog",()=>{
  let component: CourseDialogComponent;
  let fixture: ComponentFixture<CourseDialogComponent>;
  let coursesService: jasmine.SpyObj<CoursesService>;
  let mockDialogRef: MatDialogRef<CourseDialogComponent>;
  let mockCourse: any;
  let mockCoursesService: any;
  beforeEach(waitForAsync(()=>{
    mockCourse = {
        id: 1,
        titles: {
          description: 'Test Course',
          longDescription: 'Test Course Long Description'
        },
        category: 'BEGINNER'
      };
    mockCoursesService = jasmine.createSpyObj('CoursesService', ['saveCourse']);
    mockDialogRef = jasmine.createSpyObj(['close']);
    TestBed.configureTestingModule({
        imports:[
            CoursesModule,
            ReactiveFormsModule,
            NoopAnimationsModule,
            BrowserModule
        ],
        providers: [
            { provide: MAT_DIALOG_DATA, useValue: mockCourse },
            { provide: MatDialogRef, useValue: mockDialogRef },
            { provide: CoursesService, useValue: mockCoursesService }
        ],    
    }).compileComponents()
    .then(() => {
        fixture = TestBed.createComponent(CourseDialogComponent);
        component = fixture.componentInstance;
        // coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
        // coursesService.saveCourse.and.returnValue(of());
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call coursesService.saveCourse and close the dialog on save', () => {
    mockCoursesService.saveCourse.and.returnValue(of({}));
    component.save();
    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith
  });
})
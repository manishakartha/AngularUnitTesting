import { ReactiveFormsModule } from "@angular/forms";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { CourseComponent } from "./course.component";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { Course } from "../model/course";  // Import the Course type
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

describe("CourseComponent", () => {
  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;
  let coursesService: jasmine.SpyObj<CoursesService>;


  const mockCourse: Course = {
    id: 1,
    seqNo: 1,
    titles: { description: 'Angular Course', longDescription: 'Comprehensive Angular Course' },
    iconUrl: 'https://example.com/icon.png',
    uploadedImageUrl: 'https://example.com/uploaded-image.png',
    courseListIcon: 'https://example.com/course-list-icon.png',
    category: 'BEGINNER',
    lessonsCount: 10
  };

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findLessons']);
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        BrowserModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { course: mockCourse } } },
        },
      ],
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CourseComponent);
      component = fixture.componentInstance;
      coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
      coursesService.findLessons.and.returnValue(of([]));
     
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with course data', () => {
    expect(component.course).toEqual(mockCourse);
  });

  it('should load lessons when paginator changes', () => {
    component.ngAfterViewInit();
    component.paginator.pageSize = 5;
    component.paginator.pageIndex = 1;
    component.paginator.page.emit();
    expect(coursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 1, 5);
  });

  it('should load lessons when sort changes', () => {
    component.ngAfterViewInit();
    component.sort.direction = 'desc';
    component.sort.sortChange.emit();
    expect(coursesService.findLessons).toHaveBeenCalledWith(1, '', 'desc', 0, 3);
  });

  it('should load lessons on init', () => {
    component.ngOnInit();
    expect(coursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);
  });

  

});

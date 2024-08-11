import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { title } from 'process';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

let component:CoursesCardListComponent;
let fixture :   ComponentFixture<CoursesCardListComponent>
let el:DebugElement

describe('CoursesCardListComponent', () => {
  beforeEach(waitForAsync(()=>{
    TestBed.configureTestingModule({
      imports:[CoursesModule,MatDialogModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jasmine.createSpy('open').and.returnValue({
              afterClosed: () => of(true)
            })
          }
        }
      ]
    }).compileComponents()
    .then(()=>{
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component=fixture.componentInstance;
      el = fixture.debugElement
    })

  }));

  
  it("should create the component", () => {
    expect(component).toBeTruthy()

    
 
   });
  it("should display the course list", () => {
   component.courses=setupCourses();
   fixture.detectChanges();
   const cards = el.queryAll(By.css(".course-card"));
   expect(cards).toBeTruthy("Could not find Cards");
   expect(cards.length).toBe(12,"unexpected number of courses");
 

  });


  it("should display the first course", () => {
    component.courses=setupCourses();
    fixture.detectChanges();
    const course=component.courses[0];
    const card = el.query(By.css(".course-card:first-child")), 
          title=card.query(By.css("mat-card-title")),
          image = card.query(By.css("img"));
    expect(card).toBeTruthy();
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);

  });
  it("should open dialog and emit event on course edit",()=>{
    const dialogSpy = TestBed.inject(MatDialog).open as jasmine.Spy;
    spyOn(component.courseEdited, 'emit');
    const course = setupCourses()[0];
    component.editCourse(course);
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy.calls.mostRecent().args[1].data).toBe(course);

    fixture.detectChanges();
    expect(component.courseEdited.emit).toHaveBeenCalled();

  });
})



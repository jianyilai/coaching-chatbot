import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'app/notification.service';
import { ToDoService } from 'app/to-do.service';

declare var window: any;

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  toDoList: any = []

  selectedTaskData = {
    _id: "",
    userId: "",
    title: "",
    dueBy: "",
    reminder: ""
  };

  selectedTaskNotifData = {
    _id: "",
    taskId: "",
    email: "",
    message: "",
    scheduledTime: ""
  };


  editFormModal: any;
  addFormModal: any;
  editForm!: FormGroup;
  addForm!: FormGroup;

  constructor(private toDoService: ToDoService, private router: Router, private notificationService: NotificationService, private fb:
    FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      dueBy: ['', Validators.required],
      reminder: [false, Validators.required]
    });

    this.addForm = this.fb.group({
      title: ['', Validators.required],
      dueBy: ['', Validators.required],
      reminder: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.toDoService.getTasksByUID().subscribe((data: any) => {
      this.toDoList = data
      console.log(this.toDoList)
    });

    this.editFormModal = new window.bootstrap.Modal(
      document.getElementById('editFormModal')
    );

    this.addFormModal = new window.bootstrap.Modal(
      document.getElementById('addFormModal')
    );
  }

  openEditFormModal(_id: string) {
    this.editFormModal.show(this.toDoService.getTaskById(_id));
    this.toDoService.getTaskById(_id).subscribe((data: any) => {
      this.selectedTaskData = data
      console.log(this.selectedTaskData)
    });
  }

  openAddFormModal() {
    this.addFormModal.show();
  }

  saveEditForm(taskId: string) {
    // get notification by taskId
    this.notificationService.getNotificationByTaskId(taskId).subscribe((data: any) => {
      this.selectedTaskNotifData = data

      // check if updated task have reminder true or false
      if (this.editForm.value.reminder == true) {
        //Update Task
        this.toDoService.updateTask(taskId, this.editForm.value.title, this.editForm.value.dueBy, this.editForm.value.reminder).subscribe();
        console.log(!this.selectedTaskNotifData)
        // check if this task have an existing notification
        if (!this.selectedTaskNotifData) {
          console.log('this task does not have a notification')
          this.notificationService.insertNotification(taskId, this.editForm.value.title, this.editForm.value.dueBy).subscribe();
          console.log('notification added')
          this.router.navigate(['/to-do'])
            .then(() => {
              window.location.reload();
            });
        } else {
          console.log('This task have a notification')
          // check if the title is changed
          if (this.selectedTaskNotifData.message == this.editForm.value.title && this.selectedTaskNotifData.scheduledTime == this.editForm.value.dueBy) {
            console.log('No changes to notification')
            this.router.navigate(['/to-do'])
              .then(() => {
                window.location.reload();
              });
          } else {
            this.notificationService.updateNotification(this.selectedTaskNotifData._id, taskId, this.editForm.value.title, this.editForm.value.dueBy).subscribe();
            console.log('Notification Updated')
            this.router.navigate(['/to-do'])
              .then(() => {
                window.location.reload();
              });
          }
        }
      } else {
        //Update Task
        this.toDoService.updateTask(taskId, this.editForm.value.title, this.editForm.value.dueBy, this.editForm.value.reminder).subscribe();
        // check if this task have an existing notification
        if (this.selectedTaskNotifData._id !== "") {
          console.log('This task have a notification')
          // remove notification
          this.notificationService.deleteNotification(this.selectedTaskNotifData._id).subscribe();
          console.log('notification removed')
          this.router.navigate(['/to-do'])
            .then(() => {
              window.location.reload();
            });
        } else {
          console.log('no notification needed')
          this.router.navigate(['/to-do'])
            .then(() => {
              window.location.reload();
            });
        }
      }
    });
    this.editFormModal.hide();
    console.log('task updated')
  }

  saveAddForm() {
    this.toDoService.insertTask(this.addForm.value.title, this.addForm.value.dueBy, this.addForm.value.reminder).subscribe(insertedId => {
      console.log(insertedId);  // insertedId is the ObjectId of the inserted task
      if (this.addForm.value.reminder == true) {
        this.notificationService.insertNotification(insertedId, this.addForm.value.title, this.addForm.value.dueBy).subscribe();
        this.router.navigate(['/to-do'])
          .then(() => {
            window.location.reload();
          });
        console.log('reminder added')
      } else {
        this.router.navigate(['/to-do'])
          .then(() => {
            window.location.reload();
          });
      }
    });
    this.addFormModal.hide();
    console.log('task added')
  }

  //delete selected task
  deleteTask(_id: string) {
    this.toDoService.deleteTask(_id).subscribe();
    // get notification by taskId
    this.notificationService.getNotificationByTaskId(_id).subscribe((data: any) => {
      this.selectedTaskNotifData = data
      if (!this.selectedTaskNotifData) {
        this.router.navigate(['/to-do'])
          .then(() => {
            window.location.reload();
          });
      }
      else {
        this.notificationService.deleteNotification(this.selectedTaskNotifData._id).subscribe();
        this.router.navigate(['/to-do'])
          .then(() => {
            window.location.reload();
          });
      }
    });
  }
}

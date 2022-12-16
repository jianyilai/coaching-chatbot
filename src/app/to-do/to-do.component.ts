import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToDoService } from 'app/to-do.service';

declare var window: any;

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  toDoList: any = []
  // {
  //   "_id": "6395f60f001ca37999d65b5d",
  //   "userid": "638d997233ae485caa946bff",
  //   "title": "Remember to do this job iomporatnta!!",
  //   "dueBy": "25-11-2023"
  // },
  // {
  //   "_id": "234267563453564734",
  //   "userid": "638d9972353476357343ae485caa946bff",
  //   "title": "fries",
  //   "dueBy": "25-11-2043"
  // }

  // selectedRowData = null;
  selectedTaskData = {
    _id: "",
    userId: "",
    title: "",
    dueBy: "",
    reminder: ""
  };

  editFormModal: any;
  addFormModal: any;
  editForm!: FormGroup;
  addForm!: FormGroup;

  constructor(private toDoService: ToDoService, private fb:
    FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      dueBy: ['', Validators.required],
      reminder: [null, Validators.required]
    });

    this.addForm = this.fb.group({
      title: ['', Validators.required],
      dueBy: ['', Validators.required],
      reminder: [null, Validators.required]
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

  saveEditForm(_id: string) {
    this.toDoService.updateTask(_id, this.editForm.value.title, this.editForm.value.dueBy, this.editForm.value.reminder).subscribe();
    location.reload()
    this.editFormModal.hide();
    console.log('task updated')
  }

  saveAddForm() {
    this.toDoService.insertTask(this.addForm.value.title, this.addForm.value.dueBy, this.addForm.value.reminder).subscribe();
    location.reload()
    this.addFormModal.hide();
    console.log('task added')

  }

  //delete selected task
  deleteTask(_id: string) {
    this.toDoService.deleteTask(_id).subscribe();
    location.reload()
  }

}

import { Component, OnInit } from '@angular/core';
import { ToDoService } from 'app/to-do.service';

declare var window: any;

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  toDoList: any = []

  editFormModal: any;

  constructor(private toDoService: ToDoService) {}

  ngOnInit(): void {
    this.editFormModal = new window.bootstrap.Modal(
      document.getElementById('editFormModal')
    );
  }

  

  openFormModal() {
    this.editFormModal.show();
  }
  saveSomeThing() {
    // confirm or save something
    this.editFormModal.hide();
  }

}

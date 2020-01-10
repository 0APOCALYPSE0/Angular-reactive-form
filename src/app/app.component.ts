import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/username.validator';
import { PasswordValidator } from './shared/password.validator';
import { RegistrationService } from './registration.service';
// import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  registrationForm: FormGroup;

  constructor (private formBuilder: FormBuilder, private rService: RegistrationService) { }

  ngOnInit(){
    this.registrationForm = this.formBuilder.group({
      userName: ['Aakash', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      cPassword: [''],
      address: this.formBuilder.group({
        city: [''],
        state: [''],
        postelCode: ['']
      }),
      alternateEmails: this.formBuilder.array([]),
    }, {validators : PasswordValidator})

    this.registrationForm.get('subscribe').valueChanges.subscribe(checkedValue => {
      const email = this.registrationForm.get('email');
      if(checkedValue){
        email.setValidators(Validators.required);
      }else{
        email.clearValidators();
      }
      email.updateValueAndValidity();
    })
  }

  

  // registrationForm = new FormGroup({
  //   userName : new FormControl('Aakash'),
  //   password : new FormControl(''),
  //   cPassword : new FormControl(''),
  //   address : new FormGroup({
  //     city : new FormControl(''),
  //     state : new FormControl(''),
  //     postelCode : new FormControl('')
  //   })
  // });

  get username(){
    return this.registrationForm.get('userName');
  }

  get email(){
    return this.registrationForm.get('email');
  }

  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.formBuilder.control(''));
  }

  loadAPIData(){
    this.registrationForm.setValue({
      userName : 'Aakash',
      email: 'giriaakash00@gmail.com',
      subscribe: false,
      password : 'test',
      cPassword : 'test',
      address : {
        city : 'Ghaziabad',
        state : 'UP',
        postelCode : '201001'
      },
      alternateEmails: []
    });
  }

  onSubmit(){
    console.log(this.registrationForm.value);
    this.rService.register(this.registrationForm.value).subscribe(
      Response => console.log("Success!", Response),
      error => console.error("Error!", error)
    );
  }

}

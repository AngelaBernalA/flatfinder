import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-flat-info',
  templateUrl: './flat-info.component.html',
  styleUrls: ['./flat-info.component.css']
})
export class FlatInfoComponent implements OnInit {
  flat: any;
  isOwner: boolean = false;
  messageForm!: FormGroup;
  messages: any[] = [];
  userMessages: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form in the constructor
    this.messageForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const flatId = this.route.snapshot.paramMap.get('id') ?? '';

  console.log('Flat ID:', flatId); // Log the flat ID to verify if it's correct

  if (!flatId) {
    console.error('Flat ID is missing');
    return;
  }

  // Fetch the flat's data
  this.firestore.collection('flats').doc(flatId).valueChanges().subscribe((flat: any) => {
    if (!flat) {
      console.error('Flat data not found');
      return;
    }

    this.flat = flat;
  
      // Check if the current user is the owner of the flat
      this.authService.getCurrentAuthUser().then(user => {
        if (user) {
          this.isOwner = user.uid === flat.user;  // Check if the current user is the owner using the flat's user UID
  
          // Fetch messages about this flat
          this.firestore.collection('messages', ref => ref.where('flatId', '==', flatId))
            .valueChanges().subscribe(messages => {
              if (this.isOwner) {
                // Owner sees all messages
                this.messages = messages;
              } else {
                // Non-owner sees only their own messages
                this.userMessages = messages.filter((message: any) => message.senderId === user.uid);
              }
            });
        }
      });
    });
  }

  // Edit the flat (redirect to edit page)
  editFlat() {
    this.router.navigate([`/edit-flat/${this.flat.id}`]);
  }

  // Send a message to the owner
  async sendMessage() {
    if (this.messageForm.valid) {
      const messageData = this.messageForm.value;
      const flatId = this.route.snapshot.paramMap.get('id');

      const user = await this.authService.getCurrentAuthUser();
      if (user) {
        await this.firestore.collection('messages').add({
          ...messageData,
          flatId: flatId,
          senderId: user.uid,
          senderName: user.displayName || 'Anonymous',
          senderEmail: user.email,
          createdAt: new Date()
        });
        alert('Message sent!');
        this.messageForm.reset();
      }
    }
  }
}

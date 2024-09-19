import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  filters = {
    userType: '',
    minAge: 0,
    maxAge: 100,
    minFlats: 0,
    maxFlats: Infinity,
    isAdmin: ''
  };
  
  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const age = this.calculateAge(user.birthDate);
      const isUserTypeMatch = this.filters.userType === '' || (this.filters.userType === 'admin' && user.isAdmin) || (this.filters.userType === 'regular' && !user.isAdmin);
      const isAgeMatch = age >= this.filters.minAge && age <= this.filters.maxAge;
      const isFlatsMatch = user.flatsCounter >= this.filters.minFlats && user.flatsCounter <= this.filters.maxFlats;
      const isAdminMatch = this.filters.isAdmin === '' || (this.filters.isAdmin === 'true' && user.isAdmin) || (this.filters.isAdmin === 'false' && !user.isAdmin);
      return isUserTypeMatch && isAgeMatch && isFlatsMatch && isAdminMatch;
    });
  }
  

  ngOnInit(): void {
    // Fetch all users from Firestore
    this.firestore.collection('users').valueChanges().subscribe((users: any[]) => {
      this.users = users;
      this.filteredUsers = [...this.users];  // Initialize filtered users
    });
  }

  // Calculate age based on birthdate
  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // Sorting function
  sortBy(field: string) {
    this.sortField = field;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredUsers.sort((a, b) => {
      const compareA = a[field].toLowerCase();
      const compareB = b[field].toLowerCase();
      if (compareA < compareB) return this.sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Grant admin permissions to a user
  grantAdmin(user: any) {
    this.firestore.collection('users').doc(user.uid).update({ isAdmin: true });
  }

  // Remove user
  removeUser(user: any) {
    if (confirm(`Are you sure you want to remove ${user.firstName} ${user.lastName}?`)) {
      // Remove the user document from Firestore
      this.firestore.collection('users').doc(user.uid).delete()
        .then(() => {
          console.log(`User ${user.firstName} ${user.lastName} removed from Firestore`);
        })
        .catch(error => {
          console.error("Error removing user: ", error);
        });
  
      // Optionally, also remove the user from Firebase Authentication
      this.authService.getCurrentAuthUser().then(admin => {
        if (admin) {
          admin.delete().then(() => {
            console.log(`User ${user.firstName} ${user.lastName} removed from Firebase Authentication`);
          }).catch(error => {
            console.error("Error removing user from Firebase Authentication: ", error);
          });
        }
      });
    }
  }

  // View user profile
  viewUserProfile(user: any) {
    // Navigate to the user's profile page (needs route setup)
  }
}

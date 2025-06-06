import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy for cleanup
import { Firestore, collection, getDocs, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router'; // Import ActivatedRoute and Params
import { Subscription } from 'rxjs'; // Import Subscription for managing observable subscriptions

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class View implements OnInit, OnDestroy { // Implement OnDestroy
  // The @Input() type can still be used if you want to pass the type directly
  // from a parent component, but we will primarily use the route parameter.
  @Input() type: 'clients' | 'cases' = 'clients';

  items: any[] = [];
  loading = false;

  // State for the edit modal
  editItem: any = null;
  showEditModal = false; // Controls visibility of the custom edit modal

  // State for the confirmation modal (for deletion)
  itemToDelete: any = null;
  showConfirmModal = false; // Controls visibility of the custom confirmation modal

  private routeSub: Subscription | undefined; // To hold the subscription to route parameters

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    // This is crucial for when the component is reused (e.g., navigating from /view/clients to /view/cases)
    this.routeSub = this.route.paramMap.subscribe(params => {
      const typeParam = params.get('type'); // Get the 'type' parameter from the URL

      // Validate the parameter to ensure it's one of the expected types
      if (typeParam === 'clients' || typeParam === 'cases') {
        this.type = typeParam; // Update the component's 'type' property
        this.loadData(); // Reload data based on the new type
      } else {
        console.warn('Invalid type parameter in URL. Defaulting to "clients".');
        this.type = 'clients'; // Default if parameter is invalid
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the route parameter observable to prevent memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * Loads data from Firestore based on the 'type' input property.
   * Sets loading state before and after data fetching.
   */
  async loadData() {
    this.loading = true;
    try {
      // Get a reference to the Firestore collection (e.g., 'clients' or 'cases')
      const colRef = collection(this.firestore, this.type);
      // Fetch documents from the collection
      const snap = await getDocs(colRef);
      // Map the document snapshots to an array of objects, including their IDs
      this.items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error loading data:', error);
      // Optionally show a user-friendly error message
    } finally {
      this.loading = false;
    }
  }

  /**
   * Opens the custom edit modal with the selected item's data.
   * @param item The item object to be edited.
   */
  openEditModal(item: any) {
    // Create a copy of the item to avoid modifying the original data directly
    this.editItem = { ...item };
    this.showEditModal = true; // Show the edit modal
  }

  /**
   * Closes the custom edit modal and clears the editItem.
   */
  closeEditModal() {
    this.showEditModal = false; // Hide the edit modal
    this.editItem = null; // Clear the item being edited
  }

  /**
   * Saves the changes made in the edit modal to Firestore.
   * Updates the document and reloads the data.
   */
  async saveEdit() {
    // Ensure an item is selected for editing and it has an ID
    if (!this.editItem?.id) {
      console.warn('No item selected for edit or item has no ID.');
      return;
    }

    this.loading = true; // Set loading state
    try {
      // Get a reference to the specific document to update
      const docRef = doc(this.firestore, this.type, this.editItem.id);
      // Destructure the ID from editItem, as it should not be part of the data to update
      const { id, ...dataToUpdate } = this.editItem;
      // Update the document in Firestore
      await updateDoc(docRef, dataToUpdate);

      this.closeEditModal(); // Close the modal after successful save
      await this.loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error('Error updating document:', error);
      // Optionally show a user-friendly error message
    } finally {
      this.loading = false; // Reset loading state
    }
  }

  /**
   * Prepares for item deletion by opening a confirmation modal.
   * @param item The item object to be deleted.
   */
  deleteItem(item: any) {
    if (!item?.id) {
      console.warn('No item selected for deletion or item has no ID.');
      return;
    }
    this.itemToDelete = item; // Store the item to be deleted
    this.showConfirmModal = true; // Show the confirmation modal
  }

  /**
   * Confirms the deletion and proceeds with deleting the item from Firestore.
   */
  async confirmDelete() {
    // Ensure an item is slated for deletion
    if (!this.itemToDelete?.id) {
      console.warn('No item to delete.');
      return;
    }

    this.loading = true; // Set loading state
    try {
      // Get a reference to the specific document to delete
      const docRef = doc(this.firestore, this.type, this.itemToDelete.id);
      // Delete the document from Firestore
      await deleteDoc(docRef);

      this.cancelDelete(); // Close the confirmation modal and clear itemToDelete
      await this.loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error('Error deleting document:', error);
      // Optionally show a user-friendly error message
    } finally {
      this.loading = false; // Reset loading state
    }
  }

  /**
   * Cancels the deletion process and closes the confirmation modal.
   */
  cancelDelete() {
    this.showConfirmModal = false; // Hide the confirmation modal
    this.itemToDelete = null; // Clear the item slated for deletion
  }
}

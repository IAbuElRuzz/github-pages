import { Component, OnDestroy, OnInit } from '@angular/core';
import { GithubService } from 'src/app/services/github.service';
import { StorageService } from 'src/app/services/storage.service';

import { User } from 'src/app/interfaces/user.model';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  toggleDidStart = true;
  labelButtonToggle = 'Stop';
  labelTimerElapsed = '0';

  timer = timer(0, 1000);
  timerRunning = false;
  timeoutReload = 30;
  timerSubscription: Subscription = new Subscription();

  minUserId = 0;
  maxUserId = 0;
  userData: User[] = [];

  constructor(
    private githubService: GithubService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.maxUserId = parseInt(this.storageService.getData() as string) ?? 0;
    this.initTimer();
  }

  /**
   * Init Timer Subscription with 30 secs Interval
   */
  initTimer() {
    if (!this.timerRunning) {
      this.timerSubscription = this.timer.subscribe((secs: number) => {
        // console.log('Elapsed secs ', secs, 'this.maxUserId ', this.maxUserId);
        this.timerRunning = true;
        // Show the timer Label(easier to track time Elapsed)
        this.labelTimerElapsed = secs.toString();
        // Check if we reached the 30 second timeout
        if (secs % this.timeoutReload === 0) {
          this.getUserData(this.maxUserId);
        }
      });
    }
  }

  /**
   * Get Data from Github Service
   * @param lastId The Highest UserId to be used as a parameter for `since`
   */
  getUserData(lastId: number = 0) {
    this.githubService.getAllUsers(lastId).subscribe({
      next: (data: any) => {
        this.userData = data;
        //  console.log('data ', data);
        
        // Get the highest UserId in the list of users, and use that
        // as offset in the next request
        this.maxUserId = Math.max(...data.map((user: any) => user.id));

        // Get the lowest UserId(could be used to restart/reset at userId at same index)
        this.minUserId = Math.min(...data.map((user: any) => user.id));

        // Store the highest userId from the last Request
        this.storageService.setData(this.maxUserId);
      },
      error: (error: any) => {
        console.log('Error ', error);
      },
    });
  }

  /**
   * Reset Initial State
   * Clear everything including localStorage
   */
  resetData() {
    this.maxUserId = 0;
    this.storageService.clearAllData();
    if (this.timerRunning) {
      this.toggleStartStop();
    }
    this.getUserData();
  }

  /**
   * Fetch the next set of Users
   * Use the maxId of the lastfetch
   * Destroy the timer(stop the rxjs timer)
   */
  goForward() {
    if (this.maxUserId >= 0) {
      this.destroyTimer();
      this.getUserData(this.maxUserId);
    }
  }
  /**
   * Toggle Start/Stop
   * Set Label(button, counter) if timer is running
   */
  toggleStartStop() {
    this.toggleDidStart = !this.toggleDidStart;
    this.labelButtonToggle = this.toggleDidStart === true ? 'Stop' : 'Start';
    if (!this.toggleDidStart) {
      this.destroyTimer();
    } else {
      this.initTimer();
    }
  }

  /**
   * Destroy Timer/Destroy Subscription
   * Reset all labels to initial State
   */
  destroyTimer() {
    this.timerSubscription.unsubscribe();
    this.labelButtonToggle = 'Start';
    this.labelTimerElapsed = '0';

    this.toggleDidStart = false;
    this.timerRunning = false;
  }

  /**
   * Lifecycle method, ngOnDestroy
   */
  ngOnDestroy() {
    this.destroyTimer();
  }
}

#!/usr/bin/env python3

import requests
import json
import datetime
import subprocess
import os
import sys
from crontab import CronTab
import argparse
import time

# Default sound file to play
DEFAULT_SOUND_URL = "https://www.youtube.com/watch?v=2-XRbcLQ6b8"
# Default prayers to schedule
DEFAULT_PRAYERS = ["fajr", "dhuhr", "maghrib"]


def fetch_prayer_times():
    """Fetch prayer times from alwaqt.app API for today's date"""
    url = f"https://alwaqt.app/api/timings"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching prayer times: {e}")
        sys.exit(1)


def schedule_cron_jobs(
    prayer_times, sound_url, chromecast_device, prayers_to_schedule, test_mode=False
):
    """Schedule cron jobs for each prayer time in a project-specific crontab file"""
    # Initialize a new CronTab object with the project-specific file
    cron = CronTab(user=True)

    # Clear the entire crontab file
    cron.remove_all(comment="prayer_clock")

    # Define prayers that are always in PM (afternoon/evening)
    pm_prayers = ["dhuhr", "sunset", "maghrib"]

    if test_mode:
        # Schedule a test job to run 1 minute from now
        current_time = datetime.datetime.now()
        test_time = current_time + datetime.timedelta(minutes=1)

        job = cron.new(
            command=f'bash -lc catt -d "{chromecast_device}" cast "{sound_url}" --seek-to 45 > /dev/null 2>&1',
            comment="prayer_clock",
        )

        # Set the time to 1 minute from now
        job.setall(
            f"{test_time.minute} {test_time.hour} {test_time.day} {test_time.month} *"
        )

        print(
            f"TEST MODE: Scheduled test job at {test_time.hour}:{test_time.minute:02d} (1 minute from now)"
        )
    else:
        # Schedule a new job for each prayer time (if it's in the list of prayers to schedule)
        for prayer, time_str in prayer_times.items():
            # Skip if this prayer is not in the list of prayers to schedule
            if prayer.lower() not in [p.lower() for p in prayers_to_schedule]:
                continue

            # Parse the time (format is "h:mm" like "5:23" or "11:45")
            hour, minute = map(int, time_str.split(":"))

            # Convert to 24-hour format for PM prayers if needed
            if prayer.lower() in pm_prayers and hour < 12:
                hour += 12
                print(f"Converted {prayer} time to PM: {hour}:{minute:02d}")

            # Create the cron job
            job = cron.new(
                command=f'catt -d "{chromecast_device}" cast "{sound_url}" --seek-to 45 > /dev/null 2>&1',
                comment="prayer_clock",
            )

            # Set the time
            job.setall(f"{minute} {hour} * * *")

            print(f"Scheduled {prayer} at {time_str} ({hour}:{minute:02d})")

    # Write the crontab to the project-specific file
    cron.write()
    print(f"Cron jobs written")


def main():
    parser = argparse.ArgumentParser(
        description="Schedule prayer times as cron jobs to play sounds on Chromecast"
    )
    parser.add_argument(
        "--sound", default=DEFAULT_SOUND_URL, help="URL of the sound file to play"
    )
    parser.add_argument("--device", required=True, help="Name of the Chromecast device")
    parser.add_argument(
        "--prayers",
        nargs="+",
        default=DEFAULT_PRAYERS,
        help="List of prayers to schedule (default: fajr, dhuhr, maghrib). Options: sunrise, imsak, fajr, dhuhr, sunset, maghrib",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Test mode: Schedule a cron job to run 1 minute from now",
    )

    args = parser.parse_args()

    # Fetch prayer times
    print("Fetching prayer times...")
    prayer_times = fetch_prayer_times()
    print(f"Prayer times for today: {prayer_times}")

    if args.test:
        print("TEST MODE ENABLED: Will schedule a test job to run 1 minute from now")
    else:
        print(f"Scheduling the following prayers: {', '.join(args.prayers)}")

    # Schedule cron jobs
    schedule_cron_jobs(prayer_times, args.sound, args.device, args.prayers, args.test)


if __name__ == "__main__":
    main()

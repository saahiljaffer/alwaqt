#!/usr/bin/env python3

import requests
import datetime
import os
import sys
from crontab import CronTab
import argparse

# Default sound file to play
DEFAULT_SOUND_PATH = os.path.join(os.path.dirname(__file__), "adhan.mp4")
# Default prayers to schedule
DEFAULT_PRAYERS = ["fajr", "dhuhr", "maghrib"]
LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prayer_times.log")


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
    prayer_times, sound_path, chromecast_device, prayers_to_schedule, test_mode=False
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
        
        # Add logging to the command
        log_cmd = f'echo "$(date): Starting test prayer time cast" >> {LOG_FILE} 2>&1'
        cast_cmd = f'catt -d "{chromecast_device}" cast "{sound_path}" --seek-to 45 >> {LOG_FILE} 2>&1'
        job = cron.new(
            command=f'{log_cmd} && {cast_cmd}',
            comment="prayer_clock",
        )

        # Set the time to 1 minute from now
        job.setall(f"{test_time.minute} {test_time.hour} {test_time.day} {test_time.month} *")
        
        print(f"TEST MODE: Scheduled test job at {test_time.hour}:{test_time.minute:02d} (1 minute from now)")
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

            # Add logging to the command
            log_cmd = f'echo "$(date): Starting {prayer} prayer time cast" >> {LOG_FILE} 2>&1'
            cast_cmd = f'catt -d "{chromecast_device}" cast "{sound_path}" --seek-to 45 >> {LOG_FILE} 2>&1'
            
            # Create the cron job with logging
            job = cron.new(
                command=f'{log_cmd} && {cast_cmd}',
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
        "--sound", default=DEFAULT_SOUND_PATH, help="Sound file to play"
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

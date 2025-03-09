# Prayer Times Cron Scheduler

This script fetches prayer times from alwaqt.app API and schedules cron jobs to play sounds on a Chromecast device at those times.

## Prerequisites

- Python 3.6+
- `catt` (Chromecast CLI) installed and working
- A Chromecast device on your network

## Installation

1. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

2. Make the script executable:
   ```
   chmod +x prayer_times_cron.py
   ```

## Usage

Run the script with the name of your Chromecast device:

```
./prayer_times_cron.py --device "Living Room TV"
```

### Optional Arguments

- `--sound URL`: URL of the sound file to play (defaults to an Adhan sound)
- `--user USERNAME`: User for crontab (defaults to current user)

Example with all options:

```
./prayer_times_cron.py --device "Living Room TV" --sound "https://example.com/custom-adhan.mp3" --user myusername
```

## How It Works

1. The script fetches prayer times for the current day from alwaqt.app API
2. It then creates or updates cron jobs to play the specified sound on your Chromecast device at each prayer time
3. Previous prayer time cron jobs are removed before adding new ones

## Automatic Daily Updates

To automatically update the prayer times each day, you can add a cron job to run this script daily:

```
0 0 * * * /path/to/prayer_times_cron.py --device "Your Device Name" > /dev/null 2>&1
```

This will run the script at midnight every day, updating the prayer time cron jobs for the new day.

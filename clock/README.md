# Prayer Times Scheduler

This script fetches prayer times from alwaqt.app API and schedules cron jobs to play sounds on a Chromecast device at those times.

## Prerequisites

- Python 3.6+
- `catt` (Chromecast CLI) installed and working
- A Chromecast device on your network

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/alwaqt.git
   cd alwaqt
   ```

2. Create a virtual environment (recommended):

   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```
   pip install requests python-crontab catt
   ```

## Usage

### Basic Usage

Run the script with the name of your Chromecast device:

```
python clock/main.py --device "Living Room TV"
```

By default, this will schedule only the Maghrib prayer time.

### Optional Arguments

- `--sound URL`: URL of the sound file to play (defaults to an Adhan sound)
- `--prayers`: List of prayers to schedule (default: maghrib)
  - Options: fajr, dhuhr, asr, maghrib, isha
- `--test`: Test mode that schedules a cron job to run 1 minute from now

### Examples

Schedule only Maghrib prayer:

```
python clock/main.py --device "Living Room TV"
```

Schedule multiple prayers:

```
python clock/main.py --device "Living Room TV" --prayers fajr maghrib isha
```

Test the setup (will play sound after 1 minute):

```
python clock/main.py --device "Living Room TV" --test
```

## How It Works

1. The script fetches prayer times for the current day from alwaqt.app API
2. It creates a project-specific crontab file (`prayer_times.crontab`) in the clock directory
3. It installs this crontab file to the system using the `crontab` command
4. The cron daemon reads this file and executes the commands at the specified times

## Adding the Cron File to the System

### Automatic Installation (Built into the Script)

The script automatically installs the crontab file to the system using the `crontab` command. When you run the script, it:

1. Creates a crontab file at `clock/prayer_times.crontab`
2. Runs `crontab clock/prayer_times.crontab` to install it to the system
3. The cron daemon automatically picks up the changes

This process replaces your current user's crontab with the new one. If you already have other cron jobs set up, see the "Preserving Existing Cron Jobs" section below.

### Manual Installation

If you need to manually install the crontab file:

```bash
# After running the script once to generate the prayer_times.crontab file
crontab clock/prayer_times.crontab
```

### Verifying Installation

To verify that your crontab has been installed correctly:

```bash
crontab -l
```

This should display the contents of your installed crontab file with the prayer time jobs.

### Preserving Existing Cron Jobs

If you already have other cron jobs and don't want to lose them:

1. Export your current crontab:

   ```bash
   crontab -l > my_current_crontab
   ```

2. Run the prayer times script to generate the prayer_times.crontab file:

   ```bash
   python clock/main.py --device "Your Device" --test
   ```

3. Combine the crontab files:

   ```bash
   cat my_current_crontab clock/prayer_times.crontab > combined_crontab
   ```

4. Install the combined crontab:
   ```bash
   crontab combined_crontab
   ```

## Setting Up Automatic Daily Updates

To ensure the prayer times are updated daily (to account for changing prayer times throughout the year), you should set up a daily cron job to run the script:

1. Create a shell script wrapper (recommended for using with virtual environments):

   ```bash
   # Create update_prayer_times.sh
   echo '#!/bin/bash
   cd /path/to/alwaqt
   source venv/bin/activate
   python clock/main.py --device "Your Device Name"' > update_prayer_times.sh

   # Make it executable
   chmod +x update_prayer_times.sh
   ```

2. Add a daily cron job to run this script:

   ```bash
   # Export current crontab
   crontab -l > current_crontab

   # Add daily update job (runs at 12:01 AM)
   echo "1 0 * * * /path/to/alwaqt/update_prayer_times.sh" >> current_crontab

   # Install updated crontab
   crontab current_crontab
   ```

## Cron System Requirements

For the cron jobs to run properly:

1. The cron daemon must be running on your system:

   ```bash
   # On systemd-based systems (like Ubuntu, Debian)
   sudo systemctl status cron

   # If not running, start it with:
   sudo systemctl start cron
   sudo systemctl enable cron
   ```

2. Your user must have permission to use crontab:

   - Check if your username is in /etc/cron.allow (if it exists)
   - Make sure your username is not in /etc/cron.deny

3. The system must be running at the scheduled times (not suspended/hibernated)

## Troubleshooting

### Cron Jobs Not Running

1. Check if cron daemon is running:

   ```bash
   systemctl status cron
   ```

2. Check your crontab installation:

   ```bash
   crontab -l
   ```

3. Check system logs for cron errors:

   ```bash
   grep CRON /var/log/syslog
   ```

4. Test the catt command manually:

   ```bash
   catt -d "Your Device Name" cast "https://example.com/sound.mp3"
   ```

5. Make sure the full paths in your cron jobs are correct:
   ```bash
   which python
   which catt
   ```

### Sound Not Playing

1. Make sure your Chromecast device is on and connected to the network
2. Run the script in test mode to verify the setup:
   ```bash
   python clock/main.py --device "Your Device Name" --test
   ```
3. Check if the cron job is running but failing by adding logging:
   ```bash
   # Modify your cron job to log output
   crontab -e
   # Change the job to:
   * * * * * /path/to/command > /tmp/cron_log.txt 2>&1

   ```

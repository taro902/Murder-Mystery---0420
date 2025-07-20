const fileSystem = [
  {
    name: 'home',
    type: 'directory',
    contents: [
      {
        name: 'joe-vallen',
        type: 'directory',
        contents: [
          {
            name: 'Desktop',
            type: 'directory',
            contents: [
              {
                name: 'email_draft.txt',
                type: 'file',
                mimeType: 'ASCII text',
                content: `Subject: This is your last warning...

Dear [REDACTED],

I know what you did. I have evidence. The Circle won't protect you anymore.
Meet me tonight at the old warehouse, 11 PM. Come alone.

This is your last chance before I go public.

- Someone who knows too much

P.S. The money wasn't enough. You know what I want.`
              },
              {
                name: 'README.txt',
                type: 'file',
                mimeType: 'ASCII text',
                content: `Welcome to the investigation.

Joe Vallen was found dead in his apartment. Laptop was still warm.
Initial assessment: suicide. But something feels wrong...

Your job: investigate the laptop and find the truth.

Commands available: ls, cd, cat, pwd, grep, find, file, help
Look in Documents, Pictures, Downloads, and hidden folders.`
              }
            ]
          },
          {
            name: 'Documents',
            type: 'directory',
            contents: [
              {
                name: 'diary.txt',
                type: 'file',
                mimeType: 'ASCII text',
                content: `March 14, 2024 - 11:47 PM

I can't sleep. The guilt is eating me alive. Project Nightfall wasn't supposed to go this far. When we started The Circle, it was just supposed to be about exposing corruption. But now... now we're the corruption.

Sarah tried to warn me. Said we were crossing a line. But the money was too good, the power too intoxicating. And now there's no way out.

I found the files. The real ones. Not the sanitized versions we show the clients. The ones that prove we're not just blackmailing corrupt politicians - we're creating them.

Tomorrow I'm meeting with [REDACTED]. I have to end this. Even if it means destroying everything we've built.

If anything happens to me, check the hidden folder. The password is in the photo.

- Joe`
              },
              {
                name: 'work_notes.txt',
                type: 'file',
                mimeType: 'ASCII text',
                content: `Project Nightfall Update:
- 47 targets identified
- $2.3M in revenue this quarter
- 3 new members initiated
- Security protocols updated

Note: Must increase server encryption. Someone's been probing our systems.`
              }
            ]
          },
          {
            name: 'Pictures',
            type: 'directory',
            contents: [
              {
                name: 'vacation.jpg',
                type: 'file',
                mimeType: 'JPEG image data',
                content: `[Photo of a tropical beach - metadata shows last modified: 2024-03-10]`
              },
              {
                name: 'private',
                type: 'directory',
                contents: [
                  {
                    name: '.death_note.jpg',
                    type: 'file',
                    hidden: true,
                    mimeType: 'JPEG image data',
                    content: `Encrypted image showing:
"The truth is in the code"
"Check /var/log/auth.log"
"Password: Circle42"
"Trust no one from The Circle"`
                  }
                ]
              }
            ]
          },
          {
            name: 'Downloads',
            type: 'directory',
            contents: [
              {
                name: 'bank_statement.pdf',
                type: 'file',
                mimeType: 'PDF document',
                content: `Bank Statement - First National Bank
Account: ****1234
Period: March 1-15, 2024

Deposits:
- March 3: +$50,000 (Wire transfer from offshore account)
- March 10: +$10,000 (Cash deposit)

Suspicious activity noted by bank's fraud detection system`
              },
              {
                name: 'encrypted_evidence.zip',
                type: 'file',
                mimeType: 'Zip archive data',
                content: `[Encrypted archive - requires password]`
              }
            ]
          },
          {
            name: '.bash_history',
            type: 'file',
            hidden: true,
            mimeType: 'ASCII text',
            content: `ssh darknet@192.168.1.100
python3 encrypt_evidence.py
curl -X POST https://darkweb.com/upload -F "file=@evidence.zip"
rm -rf /var/log/auth.log.1
history -c
echo "Digital suicide complete" > /tmp/status
shutdown -h now`
          }
        ]
      }
    ]
  },
  {
    name: 'var',
    type: 'directory',
    contents: [
      {
        name: 'log',
        type: 'directory',
        contents: [
          {
            name: 'auth.log',
            type: 'file',
            mimeType: 'ASCII text',
            content: `Mar 15 14:23:45 joe-vallen-laptop sshd[2847]: Accepted publickey for darknet from 192.168.1.100 port 48272 ssh2: RSA SHA256:Circle42
Mar 15 14:25:12 joe-vallen-laptop sudo:    joe-vallen : TTY=pts/0 ; PWD=/home/joe-vallen ; USER=root ; COMMAND=/bin/rm -rf /var/log/auth.log
Mar 15 14:30:00 joe-vallen-laptop CRON[2901]: (joe-vallen) CMD (python3 /home/joe-vallen/encrypt_evidence.py)
Mar 15 15:00:00 joe-vallen-laptop sudo:    joe-vallen : TTY=pts/0 ; PWD=/home/joe-vallen ; USER=root ; COMMAND=/usr/bin/curl -X POST https://darkweb.com/upload
Mar 15 15:45:00 joe-vallen-laptop systemd[1]: Started Cleanup of Temporary Directories.
Mar 15 16:00:00 joe-vallen-laptop systemd[1]: Reached target Power-Off.`
          }
        ]
      }
    ]
  }
];

const globalTemperatures = {
  'New York': '18°C',
  'London': '12°C',
  'Tokyo': '22°C',
  'Sydney': '25°C',
  'Berlin': '8°C',
  'Moscow': '-2°C',
  'Dubai': '35°C',
  'Singapore': '30°C'
};
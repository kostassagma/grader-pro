import paramiko
import time

form_submit_file_path = "formsubmit.c"


def submit_file(cookie:str, task_id:str, username: str, password: str, file:str):

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("novice.softlab.ntua.gr",22,username,password)


    # Invoking Shell
    channel = client.invoke_shell()
    out = channel.recv(9999)

    while not channel.recv_ready():
        time.sleep(1)

    out = channel.recv(9999)

    # Accepting terms
    channel.send('\n')

    while not channel.recv_ready():
        time.sleep(1)

    out = channel.recv(9999)


    print("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")

    # writing file
    channel.send('edit file_to_be_submitted.cpp\n')
    channel.send('ggdG\n')
    channel.send(':set paste\n')
    channel.send('I')
    for i in file:
        channel.send(i)
    channel.send('\x1B')
    channel.send(':wq\n')


    while not channel.recv_ready():
        time.sleep(1)
    out = channel.recv(9999)

    # writing formsubmit
    channel.send('edit formsubmit.c\n')
    
    while not channel.recv_ready():
        time.sleep(1)
    out = channel.recv(9999)
    channel.send('ggdG\n')
    channel.send(':set paste\n')
    channel.send('I')
    with open(form_submit_file_path, 'r') as file:
        file_content = file.read()
    print(file_content)
    channel.send(file_content)
    channel.send('\x1B')
    channel.send(':wq\n')


    while not channel.recv_ready():
        time.sleep(1)
    out = channel.recv(9999)

    # writing config.txt
    channel.send('edit config.txt\n')
    channel.send('ggdG\n')
    
    channel.send('I')
    channel.send(f'cookie={cookie}\n')
    channel.send(f'task={task_id}\n')
    channel.send(f'filename=file_to_be_submitted.cpp\n')
    channel.send('\x1B')
    channel.send(':wq\n')

    while not channel.recv_ready():
        time.sleep(1)
    out = channel.recv(9999)

    # compiling
    channel.send('cc formsubmit.c\n')

    while not channel.recv_ready():
        time.sleep(1)
    out = channel.recv(9999)

    # compiling
    channel.send('run formsubmit.exec\n')

    while not channel.recv_ready():
        time.sleep(1)
    out = channel.recv(9999)


    client.close()



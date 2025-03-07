#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <netdb.h>

#define h_addr h_addr_list[0]

#define PORT 80
#define BUFFER_SIZE 4096

void send_http_post_request(const char *hostname, const char *path, const char *cookies, const char *body)
{
    int sock;
    struct sockaddr_in server_addr;
    struct hostent *host;

    host = gethostbyname(hostname);
    if (host == NULL)
    {
        herror("gethostbyname failed");
        exit(EXIT_FAILURE);
    }

    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);
    memcpy(&server_addr.sin_addr.s_addr, host->h_addr, host->h_length);

    if (connect(sock, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
    {
        perror("Connection to server failed");
        close(sock);
        exit(EXIT_FAILURE);
    }

    char request[BUFFER_SIZE];
    snprintf(request, sizeof(request),
             "POST %s HTTP/1.1\r\n"
             "Host: %s\r\n"
             "Cookie: %s\r\n"
             "Content-Type: application/x-www-form-urlencoded\r\n"
             "Content-Length: %zu\r\n"
             "Connection: close\r\n"
             "\r\n"
             "%s",
             path, hostname, cookies, strlen(body), body);

    send(sock, request, strlen(request), 0);

    char response[BUFFER_SIZE];
    while (recv(sock, response, sizeof(response) - 1, 0) > 0)
    {
        printf("%s", response);
        memset(response, 0, sizeof(response));
    }

    close(sock);
}

char *get_cookie_string(const char *value)
{
    char *buffer = (char *)malloc(256);
    if (buffer == NULL)
    {
        perror("Failed to allocate memory");
        return NULL;
    }

    // Format the string
    snprintf(buffer, 256, "PHPSESSID=%s;", value);

    return buffer;
}

char *get_formdata_string(const char *task, char *filename)
{
    char *buffer = (char *)malloc(256);
    if (buffer == NULL)
    {
        perror("Failed to allocate memory");
        return NULL;
    }

    snprintf(buffer, 256, "task=%s&lang=%s&filename=%s", task, "C%2B%2B", filename);

    return buffer;
}

int main()
{
    FILE *file;
    char line[256];
    char param1[50];
    char param2[50];
    char param3[50];

    file = fopen("config.txt", "r");
    if (file == NULL)
    {
        perror("Error opening file");
        return EXIT_FAILURE;
    }

    while (fgets(line, sizeof(line), file))
    {
        if (sscanf(line, "cookie=%s", param1) == 1)
        {
        }
        else if (sscanf(line, "task=%s", param2) == 1)
        {
        }
        else if (sscanf(line, "filename=%s", param3) == 1)
        {
        }
    }

    fclose(file);

    const char *hostname = "grader.softlab.ntua.gr";
    const char *path = "/filesubmitcourses.php";
    const char *cookies = get_cookie_string(param1);

    const char *form_data = get_formdata_string(param2, param3);

    send_http_post_request(hostname, path, cookies, form_data);

    return 0;
}
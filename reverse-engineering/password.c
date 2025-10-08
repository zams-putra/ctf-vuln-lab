#include <stdio.h>
#include <string.h>

// what is the password?

int main(){
    const char mY_password[] = "canYoUGuessMyPass28123";
    char input_user[64];
    
    printf("What is my password: ");
    scanf("%s", &input_user);
    if(strcmp(mY_password, input_user) == 0){
        printf("FLAG{BATAGOR_SAUS_SAMBAL}");
    } else {
        printf("Thats not my password");
    }
}


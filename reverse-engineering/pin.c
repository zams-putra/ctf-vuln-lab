#include <stdio.h>

// what is the pin?

int main(){
    int mY_pin = 178002888;
    int input_user;
    
    printf("What is my pin: ");
    scanf("%d", &input_user);
    if(mY_pin == input_user){
        printf("FLAG{BATAGOR_SAUS_KACANG}");
    } else {
        printf("Thats not my pin");
    }
}
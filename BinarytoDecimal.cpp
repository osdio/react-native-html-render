#include<iostream>
#include<cmath>
using namespace std;

int main()
{
    int n,s=0,i=0;
    cin >> n;
    while(n != 0)
    {
        s = s + pow(2,i) * (n%10);
        n = n / 10;
        i++;
    }
    cout << s;
    
    
    
    
	
	
}

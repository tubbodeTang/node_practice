# Ŀ��
����һ�� lesson6 ��Ŀ�������б�д���롣

main.js: �����и� fibonacci ������fibonacci �Ľ��ܼ���http://en.wikipedia.org/wiki/Fibonacci_number ��

�˺����Ķ���Ϊ int fibonacci(int n)

�� n === 0 ʱ������ 0��n === 1ʱ������ 1;
n > 1 ʱ������ fibonacci(n) === fibonacci(n-1) + fibonacci(n-2)���� fibonacci(10) === 55;
n ���ɴ���10�������״���Ϊ Node.js �ļ�������û��ôǿ��
n Ҳ����С�� 0�������״���Ϊû���塣
n ��Ϊ����ʱ���״�
test/main.test.js: �� main �������в��ԣ���ʹ�и����ʺͷ�֧�����ʶ��ﵽ 100%��

# ֪ʶ��
ѧϰʹ�ò��Կ�� mocha : http://mochajs.org/
ѧϰʹ�ö��Կ� should : https://github.com/tj/should.js
ѧϰʹ�ò����ʸ��ǹ��� istanbul : https://github.com/gotwarlost/istanbul
�� Makefile �ı�д : http://blog.csdn.net/haoel/article/details/2886
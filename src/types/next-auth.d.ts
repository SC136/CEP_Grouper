import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    rollNumber: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      rollNumber: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    rollNumber: string;
  }
}

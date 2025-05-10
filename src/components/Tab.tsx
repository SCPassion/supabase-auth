import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Signup from "./Signup";
import Signin from "./SignIn";
import SignInOTP from "./OTP/SignInOTP";

export default function Tab() {
  return (
    <Tabs defaultValue="email" className="w-[700px] text-center">
      <TabsList>
        <TabsTrigger value="email">Email Password SignIn</TabsTrigger>
        <TabsTrigger value="link">Magic Link</TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <Signup />
        <Signin />
      </TabsContent>
      <TabsContent value="link">
        <SignInOTP />
      </TabsContent>
    </Tabs>
  );
}

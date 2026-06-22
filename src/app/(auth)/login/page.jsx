"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, Divider } from "@heroui/react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import AuthShell, { authInputClassNames, authGoogleButtonClass, authSubmitButtonClass } from "@/components/auth/AuthShell";
import toast from "react-hot-toast";

// Inner component that uses useSearchParams — must be inside <Suspense>
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle, user, loading: authLoading, syncing } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!authLoading && !syncing && user) {
      router.replace(callbackUrl);
    }
  }, [user, authLoading, syncing, router, callbackUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      router.replace(callbackUrl);
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(callbackUrl);
    } catch {
      toast.error("Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      variant="login"
      heading="Sign in"
      subheading="Don't have an account?"
      linkHref="/register"
      linkLabel="Create one free"
    >
      <Button
        fullWidth
        variant="bordered"
        isLoading={googleLoading}
        onPress={handleGoogle}
        className={`${authGoogleButtonClass} mb-6`}
      >
        <span className="inline-flex items-center justify-center gap-2.5">
          <FcGoogle size={20} />
          Continue with Google
        </span>
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <Divider className="flex-1" />
        <span className="text-default-400 text-xs font-medium uppercase tracking-wide">or</span>
        <Divider className="flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          labelPlacement="outside-top"
          type="email"
          placeholder="you@example.com"
          value={email}
          onValueChange={setEmail}
          startContent={<FiMail className="text-default-400 shrink-0" size={18} />}
          variant="bordered"
          isRequired
          classNames={authInputClassNames}
        />
        <Input
          label="Password"
          labelPlacement="outside-top"
          type={showPass ? "text" : "password"}
          placeholder="Your password"
          value={password}
          onValueChange={setPassword}
          startContent={<FiLock className="text-default-400 shrink-0" size={18} />}
          endContent={
            <button type="button" className="flex items-center" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff className="text-default-400" size={18} /> : <FiEye className="text-default-400" size={18} />}
            </button>
          }
          variant="bordered"
          isRequired
          classNames={authInputClassNames}
        />
        <Button
          type="submit"
          isLoading={loading}
          className={`${authSubmitButtonClass} mt-1`}
          fullWidth
        >
          Sign In
        </Button>
      </form>
    </AuthShell>
  );
}

// Page wrapper with Suspense — required by Next.js App Router for useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

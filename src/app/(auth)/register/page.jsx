"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Divider } from "@heroui/react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import AuthShell, { authInputClassNames, authGoogleButtonClass, authSubmitButtonClass } from "@/components/auth/AuthShell";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle, user, loading: authLoading, syncing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !syncing && user) router.replace("/");
  }, [user, authLoading, syncing, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Please enter your name");
      return;
    }
    if (!trimmedEmail) {
      toast.error("Please enter your email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({ name: trimmedName, email: trimmedEmail, password });
      toast.success("Account created! Welcome to TicketBari");
      router.replace("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      toast.error("Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      variant="register"
      heading="Create account"
      subheading="Already have an account?"
      linkHref="/login"
      linkLabel="Sign in"
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
          label="Name"
          labelPlacement="outside-top"
          placeholder="Your full name"
          value={name}
          onValueChange={setName}
          startContent={<FiUser className="text-default-400 shrink-0" size={18} />}
          variant="bordered"
          isRequired
          autoComplete="name"
          classNames={authInputClassNames}
        />
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
          autoComplete="email"
          classNames={authInputClassNames}
        />
        <Input
          label="Password"
          labelPlacement="outside-top"
          type={showPass ? "text" : "password"}
          placeholder="Minimum 6 characters"
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
          autoComplete="new-password"
          minLength={6}
          classNames={authInputClassNames}
        />
        <Button
          type="submit"
          isLoading={loading}
          className={`${authSubmitButtonClass} mt-1`}
          fullWidth
        >
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}

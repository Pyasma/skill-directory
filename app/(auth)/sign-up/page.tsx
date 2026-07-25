"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import HeaderSign from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { AuthShell } from "@/components/layout/auth-shell";
import { AuthVisual } from "@/components/layout/auth-visual";
import { SakuraPetals } from "@/components/custom/sakura-petals";
import { initialAuthState } from "@/lib/auth-state";
import {
  signInWithGithubAction,
  signInWithGoogleAction,
  signUpUserAction,
} from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [state, formAction, isPending] = useActionState(
    signUpUserAction,
    initialAuthState,
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success("Account created");
      router.push("/welcome");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [router, state]);

  return (
    <AuthShell>
      <div className="w-full h-screen">
        <div className="h-full grid lg:grid-cols-[40%_60%] xl:grid-cols-[38%_62%] overflow-hidden bg-[#faf9f6]">
          <div className="relative flex flex-col h-full bg-[#faf9f6] border-r border-[#f0ece9]">
            {/* Falling Sakura Petals Background Animation */}
            <SakuraPetals theme="sakura" />

            {/* Bleed gradient blending into the visual side */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#faf9f6]/10 hidden lg:block z-10" />

            <HeaderSign signed="Sign in" />

            <div className="flex-1 flex items-center justify-center px-8 lg:px-12 xl:px-16 py-8 relative z-10">
              <div className="w-full max-w-sm text-center animate-fade-in-up">
                <h1 className="font-heading text-[clamp(2.2rem,4.5vw,2.9rem)] font-bold tracking-tight text-[#1c1917] leading-tight">
                  Create your account
                </h1>

                <form
                  action={formAction}
                  className="mt-8 flex flex-col items-stretch gap-4.5 text-left w-full"
                >
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      formAction={signInWithGoogleAction}
                      className="bg-white border border-[#e7e5e4] text-[#44403c] hover:text-[#ea580c] hover:bg-[#fff7ed] hover:border-[#ea580c] w-full h-11 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2.5 shadow-xs hover:-translate-y-0.5 active:scale-[0.98] active:duration-75 cursor-pointer"
                    >
                      <FcGoogle className="size-5" />
                      Continue with Google
                    </Button>
                    <Button
                      type="submit"
                      formAction={signInWithGithubAction}
                      className="bg-white border border-[#e7e5e4] text-[#44403c] hover:text-[#ea580c] hover:bg-[#fff7ed] hover:border-[#ea580c] w-full h-11 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2.5 shadow-xs hover:-translate-y-0.5 active:scale-[0.98] active:duration-75 cursor-pointer"
                    >
                      <FaGithub className="size-5 text-[#1c1917]" />
                      Continue with GitHub
                    </Button>
                  </div>

                  <div className="my-3 flex items-center w-full">
                    <div className="h-px flex-1 bg-[#e7e5e4]" />
                    <span className="px-4 text-[11px] font-bold text-[#a8a29e] uppercase tracking-widest">
                      or
                    </span>
                    <div className="h-px flex-1 bg-[#e7e5e4]" />
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="border border-[#e7e5e4] focus:border-[#ea580c] rounded-xl text-sm px-4 py-3 bg-white text-[#1c1917] w-full h-12 transition-all duration-250 outline-none focus:ring-4 focus:ring-[#ffedd5] placeholder-[#a8a29e] hover:border-[#fdba74]"
                      />
                    </div>

                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="border border-[#e7e5e4] focus:border-[#ea580c] rounded-xl text-sm px-4 py-3 bg-white text-[#1c1917] w-full h-12 pr-12 transition-all duration-250 outline-none focus:ring-4 focus:ring-[#ffedd5] placeholder-[#a8a29e] hover:border-[#fdba74]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#ea580c] transition-colors hover:scale-110 active:scale-95 duration-200 hover:animate-shake"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4.5" />
                        ) : (
                          <Eye className="size-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full mt-1.5">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={checked}
                        onCheckedChange={(value) => setChecked(!!value)}
                        className="border-[#d6d3d1] data-checked:bg-[#ea580c] data-checked:border-[#ea580c] data-[state=checked]:bg-[#ea580c] data-[state=checked]:border-[#ea580c] text-white focus-visible:ring-[#ffedd5] transition-all duration-200 hover:border-[#ea580c] active:scale-90"
                      />
                      <label
                        htmlFor="remember"
                        className="text-xs text-[#57534e] cursor-pointer font-medium select-none"
                      >
                        Agree with Terms and policy
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#ea580c] text-white hover:bg-[#c2410c] disabled:bg-[#f5f5f4] disabled:text-[#a8a29e] disabled:shadow-none shadow-[0_4px_14px_rgba(234,88,12,0.28)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.42)] w-full h-12 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 group cursor-pointer mt-2 hover:-translate-y-0.5 active:scale-[0.98] active:duration-75"
                    disabled={!email || !password || !checked || isPending}
                  >
                    Create account
                    <FaArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>

                  <div className="text-[13px] text-[#57534e] text-center mt-3 select-none">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="text-[#ea580c] hover:text-[#c2410c] font-semibold transition-colors duration-200 inline-block hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <Footer />
          </div>

          <AuthVisual imageSrc="/white-magnolia.jpg" />
        </div>
      </div>
    </AuthShell>
  );
}

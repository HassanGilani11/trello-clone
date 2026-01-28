import { SignIn, SignUp } from "@clerk/nextjs";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  title: string;
  subtitle: string;
  redirectUrl: string;
  alternateUrl: string;
}

export default function AuthForm({
  mode,
  title,
  subtitle,
  redirectUrl,
  alternateUrl,
}: AuthFormProps) {
  const commonAppearance = {
    elements: {
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
      card: "shadow-lg",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
      formFieldInput:
        "border border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      footerActionLink: "text-blue-600 hover:text-blue-700",
    },
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex justify-center">
          {mode === "sign-in" ? (
            <SignIn
              appearance={commonAppearance}
              redirectUrl={redirectUrl}
              signUpUrl={alternateUrl}
            />
          ) : (
            <SignUp
              appearance={commonAppearance}
              redirectUrl={redirectUrl}
              signInUrl={alternateUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

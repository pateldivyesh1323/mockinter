import { Loader2 } from "lucide-react";
import { Button } from "./button";

export function ButtonLoading({ children, loading }: any) {
    return (
        <Button disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {children}
        </Button>
    );
}

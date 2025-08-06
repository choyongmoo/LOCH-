// src/pages/Download.tsx

import { Button } from "@/components/common/ui/button";

export const Download = () => (
  <div className="h-screen flex justify-center items-center">
    <Button asChild size="lg" className="max-w-xs w-full">
      <a
        href="/downloads/LOCH_App.apk"
        download
        className="block w-full py-4 text-center font-semibold text-lg"
      >
        Download
      </a>
    </Button>
  </div>
);

export default Download;

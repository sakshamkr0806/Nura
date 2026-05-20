import * as React from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import { getCountryCallingCode } from "react-phone-number-input";
import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Custom Input for the phone number part
const CustomInput = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <Input
      className={cn(
        "rounded-r-xl rounded-l-none border-l-0 h-11 text-sm border focus-visible:ring-2 focus-visible:ring-[rgba(246,165,142,0.3)] transition-all",
        className,
      )}
      style={{
        borderColor: error ? "#EF4444" : "rgba(246,165,142,0.2)",
        background: "#FFFAF8",
        color: "#2D1F1A",
        boxShadow: error ? "0 0 0 1px #EF4444" : "none",
      }}
      ref={ref}
      {...props}
    />
  );
});
CustomInput.displayName = "CustomInput";

// Custom Country Select Dropdown
const CountrySelect = ({ value, onChange, options, disabled, error }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedCountry = options.find((opt) => opt.value === value);
  const SelectedFlag = selectedCountry?.value
    ? flags[selectedCountry.value]
    : null;
  const selectedDialCode = selectedCountry?.value
    ? getCountryCallingCode(selectedCountry.value)
    : "";

  // Prepare and filter country list
  const countriesList = React.useMemo(() => {
    return options
      .filter((opt) => opt.value) // Remove null / "International" placeholder if any
      .map((opt) => {
        const countryCode = opt.value;
        const name = en[countryCode] || opt.label;
        const dialCode = getCountryCallingCode(countryCode);
        return {
          code: countryCode,
          name,
          dialCode,
          Flag: flags[countryCode],
        };
      })
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.dialCode.includes(searchQuery) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [options, searchQuery]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          className="flex gap-2 rounded-l-xl rounded-r-none border-r-0 h-11 px-3 focus-visible:ring-2 focus-visible:ring-[rgba(246,165,142,0.3)] transition-all border shrink-0 hover:bg-[#FFF9F7] active:scale-[0.98]"
          style={{
            borderColor: error ? "#EF4444" : "rgba(246,165,142,0.2)",
            background: "#FFFAF8",
            color: "#2D1F1A",
            boxShadow: error ? "0 0 0 1px #EF4444" : "none",
          }}
        >
          {SelectedFlag ? (
            <SelectedFlag className="w-5 h-3.5 object-cover rounded-sm border border-neutral-100" />
          ) : (
            <span className="text-xs font-semibold">Flag</span>
          )}
          <span className="text-sm font-semibold text-[#8C7B74]">
            {selectedDialCode ? `+${selectedDialCode}` : ""}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60 text-[#8C7B74]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 rounded-2xl border shadow-xl bg-white overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
        style={{ borderColor: "rgba(246,165,142,0.15)" }}
        align="start"
      >
        <div className="p-2.5 border-b border-rose-50 flex items-center gap-2 bg-[#FFFAF8]">
          <Search className="h-4 w-4 text-[#F6A58E] shrink-0" />
          <input
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm focus:outline-none text-[#2D1F1A] placeholder:text-[#8C7B74]/50"
            autoFocus
          />
        </div>
        <ScrollArea className="h-64">
          <div className="p-1.5 flex flex-col gap-0.5">
            {countriesList.length > 0 ? (
              countriesList.map((country) => {
                const CountryFlag = country.Flag;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left transition-colors duration-150 hover:bg-[#FFF4F0] text-[#2D1F1A] font-medium",
                      value === country.code &&
                        "bg-[#FFEBE5] text-[#2D1F1A] font-bold",
                    )}
                  >
                    {CountryFlag && (
                      <CountryFlag className="w-5 h-3.5 object-cover rounded-sm border border-neutral-100 shrink-0" />
                    )}
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-muted-foreground text-xs font-semibold">
                      +{country.dialCode}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="text-center py-4 text-xs font-medium text-[#8C7B74]/60">
                No country found
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export const PhoneInput = React.forwardRef(
  ({ className, value, onChange, error, ...props }, ref) => {
    // Custom CountrySelect wrapper that receives error
    const CountrySelectWithError = React.useCallback(
      (selectProps) => <CountrySelect {...selectProps} error={error} />,
      [error],
    );

    return (
      <div className={cn("flex w-full items-center", className)}>
        <PhoneInputWithCountry
          international
          defaultCountry="IN"
          value={value}
          onChange={onChange}
          inputComponent={CustomInput}
          countrySelectComponent={CountrySelectWithError}
          error={error} // Passed to CustomInput
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
PhoneInput.displayName = "PhoneInput";

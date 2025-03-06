import { useState, useRef, useEffect } from "react";

interface OtpInputProps {
    setOtp: (otp: string) => void;
    inputLength: number;
    error?: boolean;
    success?: boolean;
}

const OtpComp: React.FC<OtpInputProps> = ({ inputLength, error, success, setOtp }) => {
    const [filled, setFilled] = useState(Array(inputLength).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, inputLength);
    }, [inputLength]);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const inputVal = e.target.value;

        if (inputVal.length !== 0 && index < inputLength - 1) {
            inputRefs.current[index + 1]?.focus();
        } else if (inputVal.length === 0 && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        const newFilled = [...filled];
        newFilled[index] = inputVal;
        setFilled(newFilled);
    }

    useEffect(() => {
        if (filled.every((val) => val !== '')) {
            setOtp(filled.join(''));
        }
    }, [filled]);

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const pastedData = e.clipboardData.getData('Text');

        // Check if the pasted data is a number and has the required length
        if (!Number(pastedData) && pastedData.length === inputLength) {
            const newFilled = pastedData.split('').slice(0, inputLength);
            setFilled(newFilled);

            newFilled.forEach((val, index) => {
                if (inputRefs.current[index]) {
                    inputRefs.current[index]!.value = val;
                }
            });
        }
    }

    return (
        <div className="OtpComponent gap-2 justify-center flex">
            {Array.from({ length: inputLength }).map((_, index) => (
                <input
                    key={index}
                    ref={(el: any) => (inputRefs.current[index] = el)}
                    value={filled[index]}
                    onChange={(e) => handleInput(e, index)}
                    onPaste={handlePaste}
                    className={`${error ? 'border border-[#EC5572]' : success ? 'border border-[#79E555]' : 'border border-[#898989]'}`}
                    type="text"
                    maxLength={1}
                />
            ))}
        </div>
    );
};

export default OtpComp;

import {DatePicker} from "@sytechui/react";

export default function App() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <DatePicker
        className="max-w-[284px]"
        description={"This is my birth date."}
        firstDayOfWeek="mon"
        label="Birth date"
      />
    </div>
  );
}

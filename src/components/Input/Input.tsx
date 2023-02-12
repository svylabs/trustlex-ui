import { TextInput, TextInputProps } from "@mantine/core";
import styles from "./Input.module.scss";

interface Props extends TextInputProps {}

const Input = ({
  placeholder,
  value,
  label,
  rightSection,
  type,
  onChange,
  ...props
}: Props) => {
  // const [inputValue, setInputValue] = useState(value);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  // };

  return (
    <TextInput
      {...props}
      classNames={styles}
      type={type}
      placeholder={placeholder}
      value={value}
      label={label}
      rightSection={rightSection}
      rightSectionWidth={100}
      onChange={onChange}
    />
  );
};

export default Input;

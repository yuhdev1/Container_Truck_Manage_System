import { Autocomplete, TextField } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { LocationSuggestResponse } from "../model/dashboard";
type Props = {
  key: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
};
function LocationInput(props: Props) {
  const [options, setOptions] = useState([{ label: "" }]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    axios
      .get("http://api.map4d.vn/sdk/autosuggest", {
        params: {
          key: props.key,
          text: e.target.value,
        },
      })
      .then((res: AxiosResponse<LocationSuggestResponse>) => {
        if (res && res.data.result) {
          const locations = res.data.result;
          locations.forEach((x) => options.unshift({ label: x.address }));
        }
      });
    if (props.setState) props.setState(e.target.value);
  };

  return (
    <>
      <div className="p-2">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          size="small"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              className="outline-4"
              onChange={handleChange}
              label="Địa điểm"
            />
          )}
        />
      </div>
    </>
  );
}

export default LocationInput;

import { useEffect, useState, useRef } from "react";
import Button from "../../../UI/Button/Button";
import Input from "../../../UI/FormControls/Input";
import useConfig from "../../../../hooks/useConfig";
import useAuth from "../../../../hooks/useAuth";
import useAuthFetch from "../../../../hooks/useAuthFetch";
import useToast from "../../../../hooks/useToast";
import useProfileImageUpload from "../../../../hooks/useProfileImageUpload";
import useDialog from "../../../../hooks/useDialog";
import Autocomplete from "../../../UI/FormControls/Autocomplete";
import Select from "../../../UI/FormControls/Select";
import useAppData from "../../../../hooks/useAppData";
import useWindow from "../../../../hooks/useWindow";
import { FaLocationCrosshairs } from "react-icons/fa6";
import useMap from "../../../../hooks/useMap";
import ProfileImage from "../../../UI/Utility/ProfileImage/ProfileImage";

const ProfileView = () => {
  const { config } = useConfig();
  const { auth, setAuth, logout } = useAuth();
  const authFetch = useAuthFetch();
  const { showToast } = useToast();
  const { openDialog } = useDialog();
  const { isSmallScreen } = useWindow();

  const profileImageUploader = useProfileImageUpload(auth?.userData?._id, true);
  const imageInput = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [location, setLocation] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [isGeolocating, setIsGeolocating] = useState(false);

  const { countriesData, loadingCountries } = useAppData();
  const { getEmbeddedMapURL } = useMap();

  const handleSave = async (e) => {
    e.preventDefault();
    await authFetch(`${config.serverURL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: auth.userData._id,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setAuth((prev) => ({
          ...prev,
          userData: data.userData,
        }));
        showToast("Changes saved.", "success");
        // navigate("/me");
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to save changes.", "error");
      });
  };

    const handleLocationSave = async (e) => {
    e.preventDefault();
    await authFetch(`${config.serverURL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: auth.userData._id,
        location:{
        countryCode: location.countryCode,
        address: location.address,
        coords:location.coords,}
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setAuth((prev) => ({
          ...prev,
          userData: data.userData,
        }));
        showToast("Changes saved.", "success");
        // navigate("/me");
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to save changes.", "error");
      });
  };


  const handleResendVerification = async () =>{
   const response =await authFetch(`${config.serverURL}/user/${auth.userData._id}/resend-email-verification`, {})
    if(!response.ok){
      showToast("Failed to send verification email resent.", "error");
      return
    }
    
      showToast("Verification email resent.", "success");
  }

  const handleAccountDelete = async (e) => {
    e.preventDefault();

    if (
      !(await openDialog({
        title: "Delete your account?",
        text: "Are you sure?",
        actions: [
          { label: "Cancel", variant: "secondary", value: false },
          {
            label: "Confirm",
            variant: "primary destructive",
            value: true,
          },
        ],
      }))
    )
      return;
    await authFetch(`${config.serverURL}/user`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: auth.userData._id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        showToast("Account deleted.", "success");
      })
      .catch((error) => {
        console.log(error);
        showToast("Failed to delete account", "error");
      });
  };

  // location functions
  const handleSelectedCountryChange = (countryCode) => {
    setSelectedCountry(
      countriesData.find((country) => {
        return country.code === countryCode;
      })
    );
    setLocation({
      ...location,
      countryCode: countryCode,
    });
  };

  const getCoords = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(coords);
          },
          (error) => {
            navigator.permissions
              .query({ name: "geolocation" })
              .then((permission) =>
                console.log("Permission state:", permission.state)
              );
            let errorMessage = "Location access failed: ";
            switch (error.code) {
              case 1: // PERMISSION_DENIED
                errorMessage += "You denied location permission.";
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage +=
                  "Couldn't detect your location. Ensure GPS/Wi-Fi is on.";
                break;
              case 3: // TIMEOUT
                errorMessage += "Location request timed out. Try again.";
                break;
              default:
                errorMessage += "Unknown error (is your device online?).";
            }
            reject(new Error(errorMessage));
          }
        );
      } else {
        const msg = "Geolocation is not supported by this browser.";
        showToast(msg);
        console.log(msg);
        reject(new Error(msg));
      }
    });
  };

  const geocoding = async (query) => {
    try {
      const response = await fetch(
        `${config.geocodingProviderURL}/api/?q=${encodeURIComponent(
          query
        )}&limit=4` // might add limit to params
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const reverseGeocoding = async (coords) => {
    try {
      const response = await fetch(
        `${config.geocodingProviderURL}/reverse?lon=${coords.longitude}&lat=${coords.latitude}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetLocation = async () => {
    setIsGeolocating(true);
    const coords = await getCoords();

    const geocodeData = await reverseGeocoding(coords);
    const properties = geocodeData.features[0].properties;

    const address = `${properties.name ? properties.name + ", " : ""}${
      properties.street ? properties.street + ", " : ""
    }${properties.city ? properties.city + ", " : ""}${
      properties.country ? properties.country : ""
    }`;

    setLocation({
      ...location,
      latitude: coords.latitude,
      longitude: coords.longitude,
      countryCode: geocodeData.features[0].properties.countrycode,
      address: address,
    });
    setIsGeolocating(false);
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const geocodeData = await geocoding(query);
      const suggestions = geocodeData.features
        .filter((feature) => {
          return feature.properties.countrycode === location.countryCode;
        })
        .map((feature) => {
          const properties = feature.properties;
          const coords = feature.geometry.coordinates;

          return {
            display: `${properties.name ? properties.name + ", " : ""}${
              properties.street ? properties.street + ", " : ""
            }${properties.city ? properties.city + ", " : ""}${
              properties.country ? properties.country : ""
            }`,
            coords, // [longitude, latitude]
          };
        });
      return suggestions;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFirstName(auth.userData.firstName);
    setLastName(auth.userData.lastName);
    setUsername(auth.userData.username);
    setEmail(auth.userData.email);
    setLocation(auth.userData.location ||{})
  }, [auth]);

  return (
    <div className="view profile-view">
      <div className="container profile">
        <div className="profile-details">
          <div className="profile-container flex gap-1em">
            <ProfileImage round src={auth?.userData?.profileImageUrl} size="5rem"/>
       
    
              <input
                type="file"
                ref={imageInput}
                onChange={async (e) =>
                  await profileImageUploader.handleChange(e)
                }
                hidden
                accept={profileImageUploader.acceptString}
              />



            <div className="container flex-col gap-1em">
              <h2 className="user-name">
                {`${auth?.userData?.firstName} ${auth?.userData?.lastName}`}
              </h2>
              <div className="btn-group flex">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (imageInput.current) {
                      imageInput.current.value = "";
                    }
                    imageInput.current.click();
                  }}
                >
                  Change Profile Picture
                </Button>
                <Button variant="link" onClick={() => {}}>
                  Use default
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container personal-info">
        <h2>Personal Info</h2>
        <div className="details">
          <Input
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First name"
            validationRules={{
              required: true,
              minLength: 2,
              maxLength: 24,
            }}
          ></Input>
          <Input
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last name"
            validationRules={{
              required: true,
              minLength: 2,
              maxLength: 24,
            }}
          />
          <Input
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            validationRules={{ required: true, email: true }}
          />
          {!auth?.userData?.isEmailVerified ?(
            <p>Your email is not verified. Check your email inbox or <a href="#" onClick={handleResendVerification}>resend verification email</a>.</p>
          ):''}
          {/* <Input
                label="Mobile Number"
                name="mobileNo"
                placeholder="Enter mobile number"
              /> */}
          <div className="save-btn-container">
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="container location">
        <h2>Location</h2>
        <div className="container flex">
          <div className="details location-details">
            <Select
              label="Country"
              name="countryCode"
              value={location?.countryCode}
              onChange={(e) => handleSelectedCountryChange(e.target.value)}
              styleName={!isSmallScreen ? "col-2" : ""}
              validationRules={{ required: true }}
              defaultOption={{ label: "Select a Country", value: "" }}
              disabled={isGeolocating}
            >
              {countriesData.map((country) => (
                <option value={country.code} key={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
            <Autocomplete
              type="text"
              label="Address"
              name="address"
              value={location?.address}
              getDisplayValue={(item) => item.display}
              onSelection={(selected) => {
                setLocation({
                  ...location,
                  address: selected?.display || "",
                  longitude: selected?.coords[0] || null,
                  latitude: selected?.coords[1] || null,
                });
              }}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
              onBlur={async (e) => {
                const geocodeData = (await geocoding(e.target.value))
                
                const result = geocodeData.features.filter(
                  (feature) => {
                    return (
                      feature.properties.countrycode === location.countryCode
                    );
                  }
                );
                if (result?.length > 0) {
                  const feature = result[0];
                  const coords = feature.geometry.coordinates;
                  setLocation({
                    ...location,
                    longitude: coords[0],
                    latitude: coords[1],
                  });
                } else {
                  console.log("this wrks")
                  setLocation({
                    ...location,
                    longitude: null,
                    latitude: null,
                  });
                }
              }}
              fetchData={fetchAddressSuggestions}
              placeholder="Address (optional) eg: "
              validationRules={{ required: false }}
              disabled={isGeolocating}
            ></Autocomplete>
            <Button
              styleName={"geolocation-btn"}
              variant={"secondary"}
              onClick={handleGetLocation}
              disabled={isGeolocating}
            >
              <FaLocationCrosshairs /> {"Use My GeoLocation"}
            </Button>
            <Button
              variant="primary"
              onClick={handleLocationSave}
              disabled={isGeolocating}
            >
              Save
            </Button>
          </div>

          <div className="preview flex-col gap-1em">
            {location?.latitude && location?.longitude && (
              <div className="map-preview">
                <label>Preview</label>
                <div className="map">
                  <iframe
                    width="350"
                    height="225"
                    frameBorder="0"
                    scrolling="no"
                    src={getEmbeddedMapURL({
                      longitude: location?.longitude,
                      latitude: location?.latitude,
                    })}
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="container contact"></div> */}
      <div className="container delete-account">
        <h2>Delete Account</h2>
        <p>
          Delete your account permanently. This may not involve content linked
          to your account.
        </p>
        <Button variant="secondary" onClick={handleAccountDelete} destructive>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default ProfileView;

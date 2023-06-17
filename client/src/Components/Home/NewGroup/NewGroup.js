import React, { useRef } from "react";
import Main from "../Main/Main";
import { Form } from "react-bootstrap";

const NewGroup = () => {
  const groupRef = useRef();
  function createGroup(params) {}
  return (
    <Main>
      <Form id="sendMessage" onSubmit={createGroup}>
        <Form.Control
          type="text"
          placeholder="Enter your group name here ..."
          ref={groupRef}
          id="formInput"
          required
        />
        <Form.Check
            label="1"
            name="group1"
            type='checkbox'
            id={`inline-checkbox-1`}
          />
        <button type="submit">Create</button>

      </Form>
    </Main>
  );
};

export default NewGroup;

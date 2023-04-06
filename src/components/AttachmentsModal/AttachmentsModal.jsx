import { useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  // CardActions,
  CardContent,
  Button,
  // ButtonGroup,
  // TextField,
  // IconButton,
  CardHeader,
  Typography,
  Modal, 
  // Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { getAttachments, addAttachments } from '../../slices/formSlice';
// import AttachmentsPreview from './AttachmentsPreview

export default function AttachmentsModal(props) {
  const { attachmentsModalOpen, handleAttachmentsModalClose, modalStyles, hasAttachments, event_id } = props;
  const attachmentsList = useSelector((state) => state.form.attachmentsList);
  const dispatch = useDispatch();

  const getAttachmentsData = useCallback( async () => {
    await fetch(`/attachments/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getAttachments(response)))
      .catch(error => console.log(error));
  },[dispatch, event_id])

  useEffect(() => {
    if(hasAttachments && attachmentsModalOpen) getAttachmentsData()
  }, [getAttachmentsData, hasAttachments, attachmentsModalOpen])

  const fileUpload = async (event) => {
    event.preventDefault()
    let form = document.getElementById('fileUploadForm')
    let formData = new FormData(form)

    await fetch(`/attachments/${event_id}`, {
      method:'POST',
      body: formData
    })
    .then(response => response.json())
    .then(response => dispatch(addAttachments(response.data)))
    .catch(error => console.log(error));
  }

  return (
    <Modal
      open={attachmentsModalOpen}
      onClose={handleAttachmentsModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyles}>
        <form
          action="/attachments"
          encType="multipart/form-data"
          method="post"
          id="fileUploadForm"
        >
          <input
            type="file"
            accept="image/*"
            name="file"
            id="fileUploadInput"
            // inputProps={{
            //   name: "file",
            //   type: "file",
            //   accept: "image/*"
            // }}
          />
          <Button
            type="submit"
            id="fileUploadSubmit"
            className="btn btn-default"
            onClick={fileUpload}
          >
            Add Attachments
          </Button>
        </form>
        {attachmentsList?.length ? (
          <Card>
            <CardHeader
              // sx={cardHeaderStyles}
              title={
                <Typography>
                  Attachments:
                </Typography>
              }
            />
            <CardContent sx={{display: 'flex'}}>
              {attachmentsList.map((attachment) => (
                <img src={`${attachment.file_path.slice(8)}`} alt="attachment" key={`${attachment.attachment_id}`}/>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </Box>
    </Modal>
  )
};

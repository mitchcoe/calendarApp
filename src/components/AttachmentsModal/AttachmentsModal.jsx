import { useEffect, useCallback, useState } from 'react';
import {
  Box,
  // Card,
  // CardActions,
  // CardContent,
  Button,
  // ButtonGroup,
  TextField,
  // IconButton,
  // CardHeader,
  // Typography,
  Modal,
  Stack,
  // Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { getAttachments, addAttachments, deleteAttachments } from '../../slices/formSlice';
import AttachmentsPreview from '../AttachmentsPreview/AttachmentsPreview'

export default function AttachmentsModal(props) {
  const { attachmentsModalOpen, handleAttachmentsModalClose, modalStyles, hasAttachments, event_id } = props;
  const attachmentsList = useSelector((state) => state.form.attachmentsList);
  const [attachmentFileName, setAttachmentFileName] = useState('')
  const dispatch = useDispatch();

  const getAttachmentsData = useCallback( async () => {
    await fetch(`/attachments/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getAttachments(response)))
      .catch(error => console.log(error));
  },[dispatch, event_id])

  const deleteAttachmentsData = async (attachment_id, file_path, event_id) => {
    await fetch(`/attachments/${attachment_id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({file_path, event_id})
    })
    .then(response => response.json())
    .then(response => dispatch(deleteAttachments(response.id)))
    .then(() => getAttachmentsData())
    .catch(error => console.log(error));
  }

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
      <Box sx={[modalStyles, {width: 700, maxHeight: 700}]}>
        <form
          action="/attachments"
          encType="multipart/form-data"
          method="post"
          id="fileUploadForm"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label">
              Choose file:
              <input
                type="file"
                accept="image/*"
                name="file"
                id="fileUploadInput"
                multiple
                hidden
                onChange={(e) => setAttachmentFileName(e.target.value.slice(e.target.value.lastIndexOf('\\') + 1))}
              />
            </Button>
            <TextField
              value={attachmentFileName}
              label="Selected File:"
              variant="outlined"
              inputProps={{
                readOnly: true,
                multiple: true,
              }}
            />
            <Button
              type="submit"
              id="fileUploadSubmit"
              className="btn btn-default"
              onClick={fileUpload}
              variant="contained"
            >
              Add Attachment
            </Button>
          </Stack>
        </form>
        {attachmentsList?.length ? (
          // <Card>
          //   <CardHeader
          //     // sx={cardHeaderStyles}
          //     title={
          //       <Typography>
          //         Attachments:
          //       </Typography>
          //     }
          //   />
          //   <CardContent sx={{display: 'flex'}}>
          //     {attachmentsList.map((attachment) => (
          //       <div key={`${attachment.attachment_id}`}>
          //         <img src={`${attachment.file_path.slice(8)}`} alt="attachment" />
          //         <Button
          //           id="fileUploadDelete"
          //           className="btn btn-default"
          //           onClick={() => deleteAttachmentsData(attachment.attachment_id, attachment.file_path, event_id)}
          //         >
          //           Delete Attachment
          //         </Button>
          //       </div>
          //     ))}
          //   </CardContent>
          // </Card>
          <AttachmentsPreview attachmentsList={attachmentsList} event_id={event_id} mode="select"/>
        ) : null}
      </Box>
    </Modal>
  )
};

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch } from 'react-redux'
import { getAttachments, deleteAttachments } from '../../slices/formSlice';

export default function AttachmentsPreview(props) {
  const { attachmentsList, event_id, mode } = props;
  // console.log('AttachmentsPreview', attachmentsList, event_id)
  const dispatch = useDispatch();

  const getAttachmentsData = async () => {
    await fetch(`/attachments/${event_id}`)
      .then(response => response.json())
      .then(response => dispatch(getAttachments(response)))
      .catch(error => console.log(error));
  };

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
  };

  return (
    <ImageList sx={{ width: '100%', height: 'auto', maxHeight: 300, maxWidth: 600 }}>
      <ImageListItem key="Subheader" cols={3}>
      <ListSubheader component="div">
        <Typography>
          {mode === 'current' ? 'Attachments' : 'Selected Files'}
        </Typography>
      </ListSubheader>
      </ImageListItem>
      {attachmentsList.map((attachment) => (
        <ImageListItem key={attachment.attachment_id} sx={{maxHeight: 200, maxWidth: 200}}>
          <img
            src={`${attachment.file_path.slice(8)}?w=248&fit=crop&auto=format`}
            srcSet={`${attachment.file_path.slice(8)}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={`${attachment.file_type} attachment`}
            loading="lazy"
          />
          <ImageListItemBar
            title={attachment.file_name}
            subtitle={attachment.file_type}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`delete attachment ${attachment.file_name}`}
                onClick={() => deleteAttachmentsData(attachment.attachment_id, attachment.file_path, event_id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
